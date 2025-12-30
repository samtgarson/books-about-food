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
  idType: 'uuid',
  schemaName: 'payload',
  pool: { connectionString: process.env.DATABASE_URL },
  migrationDir: path.resolve(dirname, 'payload', 'migrations')
})
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

| Prisma Model            | Payload Collection    | Status      | Notes                                                |
| ----------------------- | --------------------- | ----------- | ---------------------------------------------------- |
| Book                    | books                 | Created     | Needs: tags (hasMany), authors (hasMany to profiles) |
| Profile                 | profiles              | Created     | Needs: user (relationship), locations (hasMany)      |
| Publisher               | publishers            | Created     | Needs: imprints (virtual join to self)               |
| User                    | users                 | Created     | Has NextAuth integration                             |
| Contribution            | contributions         | Created     | Explicit join table with relationships               |
| Image                   | images                | Created     | Needs: polymorphic owner, Payload upload config      |
| Claim                   | claims                | Created     | Needs: profile, user relationships                   |
| Tag                     | tags                  | Created     | Needs: books (virtual join)                          |
| TagGroup                | tag-groups            | Created     | Needs: tags (virtual join)                           |
| Collection              | collections           | Created     | Needs: books (hasMany)                               |
| CollectionItem          | —                     | Not needed  | Replaced by hasMany on collections                   |
| Job                     | jobs                  | Created     | Complete                                             |
| Location                | locations             | Created     | Needs: profiles (virtual join)                       |
| Feature                 | features              | Created     | Has book relationship                                |
| FeaturedProfile         | featured-profiles     | Created     | Has profile relationship                             |
| FrequentlyAskedQuestion | faqs                  | Created     | Complete                                             |
| Link                    | links                 | Created     | Has book relationship                                |
| Account                 | —                     | Not needed  | NextAuth internal                                    |
| Session                 | —                     | Not needed  | NextAuth internal                                    |
| VerificationToken       | —                     | Not needed  | NextAuth internal                                    |
| Favourite               | favourites            | Not created | Needs creation                                       |
| Membership              | memberships           | Not created | Needs creation                                       |
| PublisherInvitation     | publisher-invitations | Not created | Needs creation                                       |
| Pitch                   | pitches               | Not created | Needs creation                                       |
| Post                    | posts                 | Not created | Needs creation                                       |
| BookVote                | book-votes            | Not created | Needs creation                                       |

### Missing Collections to Create

1. **Favourites** - User favorites profiles
2. **Memberships** - User membership in publishers with role
3. **PublisherInvitations** - Invitation to join publisher team
4. **Pitches** - User pitch submissions
5. **Posts** - Blog posts with images
6. **BookVotes** - User votes for books

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

### Phase 2: Complete Collection Schema (IN PROGRESS)

**Goal:** All collections match Prisma schema with correct relationships.

**Steps:**

1. **Remove redundant fields** from all collections:

   - Remove manual `id` fields (Payload handles this)
   - Remove manual `createdAt`/`updatedAt` (Payload handles this)
   - Remove `dbName` (Payload manages its own tables in `payload` schema)

2. **Add missing relationships** to existing collections:

   - Books: `tags` (hasMany), `authors` (hasMany to profiles)
   - Profiles: `user` (relationship), `locations` (hasMany)
   - Collections: `books` (hasMany, replacing CollectionItem)
   - Images: polymorphic `owner` relationship

3. **Add virtual join fields** for bidirectional access:

   - Tags: `books` join field
   - TagGroups: `tags` join field
   - Publishers: `imprints`, `books` join fields
   - Locations: `profiles` join field
   - Jobs: `contributions` join field

4. **Create missing collections:**
   - Favourites
   - Memberships
   - PublisherInvitations
   - Pitches
   - Posts
   - BookVotes

**Browser verification:**

- [ ] All collections appear in sidebar
- [ ] Each collection shows correct fields
- [ ] Relationships can be selected and display correctly
- [ ] Virtual join fields show related records

**STOP FOR REVIEW** before proceeding to Phase 3.

---

### Phase 3: Authentication & Access Control ✅ COMPLETE

**Goal:** Admin-only access with full CRUD operations.

**Completed:**

- [x] Configured Payload auth with NextAuth integration
- [x] Admin role check via custom auth strategy
- [x] Non-admin users cannot access `/admin`

---

### Phase 4: Image Uploads

**Goal:** Image upload working with R2 storage via Payload's upload system.

**Steps:**

1. Install and configure `@payloadcms/storage-s3` for R2
2. Configure Images collection as Payload upload collection
3. Set up storage paths per image type (cover, preview, avatar, logo)
4. Migrate from polymorphic FK fields to Payload's upload pattern
5. Test upload, display, and deletion

**Browser verification:**

- [ ] Can upload images through admin
- [ ] Images display as thumbnails in list/edit views
- [ ] Images stored in correct R2 paths
- [ ] Deleting owner cleans up associated images

**STOP FOR REVIEW** before proceeding to Phase 5.

---

### Phase 5: Slug Generation & Hooks

**Goal:** Automatic slug generation and business logic hooks.

**Steps:**

1. Implement `beforeChange` hooks for slug generation per requirements
2. Test create and update flows for all slug-generating collections

**Browser verification:**

- [ ] Creating a Book auto-generates slug from title with hash
- [ ] Creating a Tag auto-generates slug from name (no hash)
- [ ] All resources generate correct slugs per requirements table

**STOP FOR REVIEW** before proceeding to Phase 6.

---

### Phase 6: Custom Field Components

**Goal:** Color pickers, computed fields, and custom displays.

**Steps:**

1. Create color picker components for book `backgroundColor` and `palette` fields
2. Implement computed State field for Claims (Pending/Approved/Cancelled)
3. Implement computed DisplayName for Contributions
4. Implement Link website dropdown/text combo

**Browser verification:**

- [ ] Color pickers display and save correctly (HSL conversion works)
- [ ] Claims show correct computed state
- [ ] Contributions show formatted display name
- [ ] Links show dropdown with custom text fallback

**STOP FOR REVIEW** before proceeding to Phase 7.

---

### Phase 7: Custom Actions

**Goal:** All admin actions working.

**Steps:**

1. Implement Publish action for Books (with email notification)
2. Implement Approve actions for Users and Claims
3. Implement Feature on Homepage for Profiles
4. Implement Add Collaborator for Books (search/create profile)
5. Implement Add Location for Profiles (Google Places integration)
6. Implement Generate Missing Palettes bulk action

**Browser verification:**

- [ ] Each action executes successfully
- [ ] Emails sent where applicable (check Inngest dashboard)
- [ ] Database updated correctly after each action

**STOP FOR REVIEW** before proceeding to Phase 8.

---

### Phase 8: Cache Invalidation & Background Jobs

**Goal:** Frontend cache updates and Inngest integration.

**Steps:**

1. Implement `afterChange`/`afterDelete` hooks to call `revalidatePath`
2. Implement Inngest triggers for palette generation on cover change
3. Test cache invalidation end-to-end

**Browser verification:**

- [ ] Editing a book and viewing the frontend shows updated content
- [ ] Cover image changes trigger palette regeneration
- [ ] Inngest dashboard shows job executions

**STOP FOR REVIEW** before proceeding to Phase 9.

---

### Phase 9: Data Migration

**Goal:** Migrate existing data from `public` schema to `payload` schema.

**Steps:**

1. Analyze Payload's generated schema in `payload` schema
2. Create data migration scripts to copy data with field mappings:
   - Handle ID format differences
   - Map old FK columns to Payload relationship format
   - Handle polymorphic image relationships
   - Map many-to-many join table data to hasMany arrays
3. Test migration in staging environment
4. Verify data integrity after migration

**Verification:**

- [ ] All records migrated successfully
- [ ] Relationships preserved correctly
- [ ] Images still accessible
- [ ] No data loss

**STOP FOR REVIEW** before proceeding to Phase 10.

---

### Phase 10: Frontend Migration

**Goal:** Migrate frontend from Prisma to Payload query API.

**Steps:**

1. Replace Prisma calls with Payload Local API calls in frontend
2. For complex queries, use Payload's Drizzle client directly
3. Update any type references from Prisma types to Payload types
4. Test all frontend features

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
