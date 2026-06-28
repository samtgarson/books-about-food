-- Scrub a CI copy of prod: truncate auth/invite/membership tables; users rows
-- are kept (content FKs need them) but anonymised. Run after restoring the dump.
begin;

truncate payload.sessions,
payload.accounts,
payload.verifications,
payload.admin_invitations,
payload.publisher_invitations,
payload.claims,
payload.memberships,
payload.payload_locked_documents,
payload.payload_preferences CASCADE;

update payload.users
set
  email = 'redacted+' || id || '@example.test',
  name = 'Redacted User',
  hash = null,
  salt = null,
  reset_password_token = null,
  reset_password_expiration = null;

commit;
