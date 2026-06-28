-- Scrub a CI database that was just restored from a production dump.
--
-- Goal: keep all public *content* (books, profiles, publishers, collections,
-- etc.) so the e2e suite has realistic data, while removing auth secrets and
-- personal data.
--
-- We cannot simply drop the `users` table: core content (books, profiles,
-- pitches, book_votes, favourites) carries `user_id` foreign keys into it, so
-- removing the rows would break referential integrity at restore/scrub time.
-- Instead we keep the `users` rows (FKs stay valid) but anonymise them, and we
-- TRUNCATE every table that is purely auth/secret/invite/membership data.
--
-- Run AFTER the dump has been restored, e.g.
--   psql "$CI_DB" -v ON_ERROR_STOP=1 -f .github/scripts/scrub-ci-db.sql
begin;

-- Pure secret / invite / membership / per-user bookkeeping tables.
-- CASCADE clears the dependent *_rels rows (e.g. payload_locked_documents_rels,
-- payload_preferences_rels) so no dangling references remain.
truncate payload.sessions,
payload.accounts,
payload.verifications,
payload.admin_invitations,
payload.publisher_invitations,
payload.claims,
payload.memberships,
payload.payload_locked_documents,
payload.payload_preferences CASCADE;

-- Anonymise the users we must keep for FK integrity: strip PII (email, name)
-- and every credential field (password hash/salt, reset tokens).
update payload.users
set
  email = 'redacted+' || id || '@example.test',
  name = 'Redacted User',
  hash = null,
  salt = null,
  reset_password_token = null,
  reset_password_expiration = null;

commit;
