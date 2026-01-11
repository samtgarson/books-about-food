# Forest Admin to Payload CMS Migration Plan

## Overview

This document outlines the migration strategy from Forest Admin to Payload CMS for the Books About Food admin system. The current admin runs on Koa.js with Forest Admin agent, managing 17+ collections with custom functionality and integrations.

**Why Payload CMS?**

- Native Next.js integration (can deploy alongside the existing web app)
- Open-source, self-hosted
- TypeScript-first with full type safety
- Config-based approach aligns with our codebase philosophy
- Built-in hooks system, access control, and custom components

---

## MVP Philosophy

This migration follows an incremental, testable approach:

1. **Get something in the browser early** - The goal of Phase 1 is to have a working admin panel visible at `/admin` as quickly as possible, even if it only shows read-only data
2. **Human review at each phase** - AI should stop for review after completing each phase before proceeding
3. **Test in browser constantly** - Every change should be verifiable in the browser before moving on
4. **Defer complexity** - Custom actions, hooks, and integrations come after basic CRUD is working
5. **Keep Forest Admin running** - Both admins run in parallel until migration is complete and verified

---

## Database Strategy (UPDATED)

### Payload as Source of Truth

After evaluation, we've decided that **Payload will be the source of truth for database structure**, replacing Prisma for the admin system. This is because:

1. Payload expects to manage its own migrations and schema
2. Keeping Prisma and Payload schemas in sync manually would be error-prone
3. Payload's native Drizzle adapter provides direct database access when needed

### Separate Schema Approach

To enable a clean migration path:

1. Payload operates in a separate PostgreSQL schema (`payload`)
2. This allows Payload to auto-generate all migrations freely
3. Once complete, we'll migrate data from the old `public` schema to the `payload` schema
4. Frontend code will then switch from Prisma to Payload's query API (or Drizzle for complex queries)

### Configuration

```typescript
// payload.config.ts
db: postgresAdapter({
  idType: "uuid",
  schemaName: "payload",
  pool: { connectionString: process.env.DATABASE_URL },
  migrationDir: path.resolve(dirname, "payload", "migrations"),
});
```

### Field Handling

Payload automatically manages these fields—do NOT define them manually:

- `id` (UUID, auto-generated)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

---

## Relationship Patterns

### Many-to-Many Without Join Tables

For simple many-to-many relationships where no additional data is needed on the relationship:

1. **Store on one side** with `hasMany: true`
2. **Virtual join on the other** for bidirectional access

Example: Books ↔ Tags

```typescript
// Books collection
{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true
}

// Tags collection
{
  name: 'books',
  type: 'join',
  collection: 'books',
  on: 'tags'
}
```

### Many-to-Many With Join Data

When additional data is needed on the relationship, use an explicit join collection:

Example: Contributions (Books ↔ Profiles with Job role)

```typescript
// Contributions collection (explicit join table)
{
  name: 'book',
  type: 'relationship',
  relationTo: 'books',
  required: true
},
{
  name: 'profile',
  type: 'relationship',
  relationTo: 'profiles',
  required: true
},
{
  name: 'job',
  type: 'relationship',
  relationTo: 'jobs',
  required: true
},
{
  name: 'tag',
  type: 'select',
  options: [{ label: 'Assistant', value: 'Assistant' }]
}
```

### Polymorphic Relationships

For Images (which can belong to Book covers, Book previews, Publisher logos, Profile avatars, or Posts):

```typescript
// Images collection - polymorphic relationship
{
  name: 'owner',
  type: 'relationship',
  relationTo: ['books', 'publishers', 'profiles', 'posts'],
  required: true
},
{
  name: 'imageType',
  type: 'select',
  options: [
    { label: 'Cover', value: 'cover' },
    { label: 'Preview', value: 'preview' },
    { label: 'Logo', value: 'logo' },
    { label: 'Avatar', value: 'avatar' },
    { label: 'Post Image', value: 'post' }
  ],
  required: true
}
```

---

## Collection Mapping

### Prisma → Payload Collection Status

| Prisma Model            | Payload Collection    | Status     | Notes                                                |
| ----------------------- | --------------------- | ---------- | ---------------------------------------------------- |
| Book                    | books                 | Created    | Needs: tags (hasMany), authors (hasMany to profiles) |
| Profile                 | profiles              | Created    | Needs: user (relationship), locations (hasMany)      |
| Publisher               | publishers            | Created    | Needs: imprints (virtual join to self)               |
| User                    | users                 | Created    | Has NextAuth integration                             |
| Contribution            | contributions         | Created    | Explicit join table with relationships               |
| Image                   | images                | Created    | Needs: polymorphic owner, Payload upload config      |
| Claim                   | claims                | Created    | Needs: profile, user relationships                   |
| Tag                     | tags                  | Created    | Needs: books (virtual join)                          |
| TagGroup                | tag-groups            | Created    | Needs: tags (virtual join)                           |
| Collection              | collections           | Created    | Needs: books (hasMany)                               |
| CollectionItem          | —                     | Not needed | Replaced by hasMany on collections                   |
| Job                     | jobs                  | Created    | Complete                                             |
| Location                | locations             | Created    | Needs: profiles (virtual join)                       |
| Feature                 | features              | Created    | Has book relationship                                |
| FeaturedProfile         | featured-profiles     | Created    | Has profile relationship                             |
| FrequentlyAskedQuestion | faqs                  | Created    | Complete                                             |
| Link                    | links                 | Created    | Has book relationship                                |
| Account                 | accounts              | Created    | NextAuth, hidden in admin                            |
| Session                 | —                     | Not needed | NextAuth internal (not migrated)                     |
| VerificationToken       | verification-tokens   | Created    | NextAuth, hidden in admin                            |
| Favourite               | favourites            | Created    | User favorites profiles                              |
| Membership              | memberships           | Created    | User membership in publishers with role              |
| PublisherInvitation     | publisher-invitations | Created    | Invitation to join publisher team                    |
| Pitch                   | pitches               | Created    | User pitch submissions                               |
| Post                    | posts                 | Created    | Blog posts with images                               |
| BookVote                | book-votes            | Created    | User votes for books                                 |

### Fields to Add to Existing Collections

**Books:**

- `tags` - hasMany relationship to tags
- `authors` - hasMany relationship to profiles (shortcut for author role)

**Profiles:**

- `user` - relationship to users (currently still text)
- `locations` - hasMany relationship to locations

**Tags:**

- `books` - virtual join field from books.tags

**TagGroups:**

- `tags` - virtual join field from tags.group

**Publishers:**

- `imprints` - virtual join field (self-referential from house)
- `books` - virtual join field from books.publisher

**Locations:**

- `profiles` - virtual join field from profiles.locations
- Remove manual `id` field (Payload handles this)

**Images:**

- Convert from multiple optional FK fields to polymorphic relationship
- Add Payload upload configuration

---

## Current System Overview

### Architecture

| Component       | Current (Forest Admin)                  | Target (Payload CMS)                      |
| --------------- | --------------------------------------- | ----------------------------------------- |
| Server          | Koa.js on Heroku (port 5001)            | Next.js (integrated into /web)            |
| Database        | PostgreSQL via Prisma (`public` schema) | PostgreSQL via Payload (`payload` schema) |
| ORM             | Prisma                                  | Payload Query API + Drizzle               |
| Background Jobs | Inngest                                 | Inngest (keep for MVP)                    |
| Image Storage   | Cloudflare R2                           | Cloudflare R2 (via Payload S3 adapter)    |
| Authentication  | Forest Admin dashboard                  | NextAuth + Payload custom auth strategy   |

---

## Functional Requirements

(See original document for complete requirements - unchanged)

---

## Migration Phases

### Phase 1: Minimal Viable Admin ✅ COMPLETE

**Goal:** See Payload admin in browser at `/admin` with basic data display.

**Completed:**

- [x] Installed Payload dependencies in `/web`
- [x] Created `payload.config.ts` with separate schema
- [x] Set up Postgres adapter with UUID IDs
- [x] Created initial collection configs
- [x] Admin loads at `localhost:5000/admin`

---

### Phase 2: Complete Collection Schema ✅ COMPLETE

**Goal:** All collections match Prisma schema with correct relationships.

**Completed:**

- [x] Removed redundant fields (manual id, createdAt, updatedAt, dbName)
- [x] Added missing relationships to existing collections
- [x] Added virtual join fields for bidirectional access
- [x] Created all missing collections (Favourites, Memberships, PublisherInvitations, Pitches, Posts, BookVotes)

---

### Phase 3: Authentication & Access Control ✅ COMPLETE

**Goal:** Admin-only access with full CRUD operations.

**Completed:**

- [x] Configured Payload auth with NextAuth integration
- [x] Admin role check via custom auth strategy
- [x] Non-admin users cannot access `/admin`

---

### Phase 4: Image Uploads ✅ COMPLETE

**Goal:** Image upload working with R2 storage via Payload's upload system.

**Completed:**

- [x] Installed and configured `@payloadcms/storage-s3` for R2
- [x] Configured Images collection as Payload upload collection
- [x] Set up storage with `payload` prefix
- [x] Migrated from polymorphic FK fields to direct upload relationships on parent entities
- [x] Images display correctly in admin and frontend

---

### Phase 5: Slug Generation & Hooks ✅ COMPLETE

**Goal:** Automatic slug generation and business logic hooks.

**Completed:**

- [x] Implemented reusable `slugField` helper with `beforeValidate` hook
- [x] Slug generation works for all collections (Books, Profiles, Publishers, Tags, etc.)
- [x] Slugs auto-generate from title/name fields

---

### Phase 6: Custom Field Components ✅ COMPLETE

**Goal:** Color pickers, computed fields, and custom displays.

**Completed:**

- [x] Created `ColorPickerField` component using Payload's `TextInput` with `BeforeInput` slot
- [x] Color picker displays color swatch alongside hex/HSL input
- [x] Implemented computed State field for Claims (stored as enum: pending/approved/cancelled)
- [x] Implemented Link website dropdown with "Other" option and conditional text field
- [x] Custom array row labels for contributions and links

---

### Phase 7: Custom Actions ✅ COMPLETE

**Goal:** All admin actions working with proper UX using Payload's native component slots.

**Completed:**

- [x] Created `BookPublishButton` component using `beforeDocumentControls` slot
- [x] Publish action updates book status to 'published'
- [x] Button only shows for non-published books
- [x] Uses Payload's native button styling and refresh patterns

---

### Phase 8: Cache Invalidation & Background Jobs ✅ COMPLETE

**Goal:** Frontend cache updates and Inngest integration.

**Completed:**

- [x] Created `cacheRevalidationPlugin` that adds `afterChange`/`afterDelete` hooks
- [x] Collections define `revalidatePaths` in `custom` config for automatic cache invalidation
- [x] Implemented `triggerPaletteGeneration` hook on `coverImage` field changes
- [x] Palette generation triggers Inngest job when cover image changes
- [x] Cache invalidation tested end-to-end

---

### Phase 9: Data Migration ✅ COMPLETE

**Goal:** Migrate existing data from `public` schema to `payload` schema.

**Completed:**

- [x] Created `migrate-data.sql` script for schema-to-schema data migration
- [x] Handled ID format (UUIDs preserved)
- [x] Mapped FK columns to Payload relationship format
- [x] Converted polymorphic image relationships (cover, avatar, logo, preview) to direct upload fields
- [x] Mapped Prisma implicit M2M join tables (`_authored_books`, `_books_tags`, `_profiles_locations`) to Payload `_rels` tables
- [x] Migrated array fields (palette, links, preview images) to Payload array tables
- [x] Embedded profiles contributions as array field
- [x] Handled partial data dumps gracefully (EXISTS checks for FK constraints)
- [x] Preserved HSL color data as JSONB for querying/sorting
- [x] Created `convert-faq-answers.ts` script to convert HTML answers to Lexical rich text format
- [x] Verified data integrity in browser

**Migration Files:**

- `src/payload/migrations/migrate-data.sql` - Main SQL migration script
- `src/payload/migrations/convert-faq-answers.ts` - HTML → Lexical converter for FAQ answers

**Usage:**

```bash
# Run SQL migration
psql $DATABASE_URL -f src/payload/migrations/migrate-data.sql

# Convert FAQ HTML to Lexical
npx tsx src/payload/migrations/convert-faq-answers.ts
```

---

### Phase 10: Frontend Migration

**Goal:** Migrate frontend from Prisma to Payload query API.

**Steps:**

1. Replace Prisma calls with Payload Local API calls in frontend
2. For complex queries, use Payload's Drizzle client directly
3. Update any type references from Prisma types to Payload types
4. Test all frontend features

**Detailed Plan:**
See `docs/prisma-to-payload-migration.md` for step-by-step instructions.

**Verification:**

- [ ] All frontend pages load correctly
- [ ] Search works
- [ ] Filtering works
- [ ] All data displays correctly

**STOP FOR REVIEW** before proceeding to Phase 11.

---

### Phase 11: Final Testing & Cutover

**Goal:** Complete migration and decommission Forest Admin.

**Steps:**

1. Full user acceptance testing with team
2. Document any workflow differences
3. Deploy to production
4. Run both admins in parallel for verification period
5. Decommission Forest Admin:
   - Remove dependencies from `/admin`
   - Delete Heroku deployment
   - Cancel Forest Admin subscription
6. Remove Prisma from packages (or keep for reference during transition)
7. Drop old `public` schema tables once verified

**Verification:**

- [ ] Team has tested all workflows
- [ ] No critical issues found
- [ ] Forest Admin fully removed
- [ ] Prisma dependencies removed

---

## Open Questions

1. ~~**Payload version:** Use latest stable 3.x release?~~ → Using 3.x
2. ~~**Database adapter:** Native Postgres adapter or Prisma adapter?~~ → Native Postgres with separate schema
3. **Custom components:** Build from scratch or use existing Payload plugins?
4. **Frontend migration order:** Migrate all at once or incrementally?

---

## References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload Relationships](https://payloadcms.com/docs/fields/relationship)
- [Payload Join Fields](https://payloadcms.com/docs/fields/join)
- [Payload Uploads](https://payloadcms.com/docs/upload/overview)
- [Payload S3 Storage Adapter](https://payloadcms.com/docs/upload/storage-adapters)
- [Payload Hooks Overview](https://payloadcms.com/docs/hooks/overview)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)
