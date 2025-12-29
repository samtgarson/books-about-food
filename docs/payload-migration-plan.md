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

## Current System Overview

### Architecture

| Component       | Current (Forest Admin)       | Target (Payload CMS)                                       |
| --------------- | ---------------------------- | ---------------------------------------------------------- |
| Server          | Koa.js on Heroku (port 5001) | Next.js (integrated into /web)                             |
| Database        | PostgreSQL via Prisma        | PostgreSQL via Prisma (shared schema)                      |
| Background Jobs | Inngest                      | Inngest (keep for MVP)                                     |
| Image Storage   | Cloudflare R2                | Cloudflare R2 (via S3 adapter)                             |
| Authentication  | Forest Admin dashboard       | Payload auth (using existing users table, admin role only) |

### Collections

The admin manages these database tables:

| Collection          | Notes                                                        |
| ------------------- | ------------------------------------------------------------ |
| Books               | Primary content with images, colors, publishing workflow     |
| Profiles            | People (authors, photographers, etc.) with avatars           |
| Publishers          | Publishing houses with logos, imprint hierarchy              |
| Users               | App users with role-based access                             |
| Contributions       | Links profiles to books with job roles                       |
| Images              | Polymorphic image storage (covers, previews, avatars, logos) |
| Claims              | Profile ownership requests                                   |
| Tags                | Book categories                                              |
| Tag Groups          | Tag category groupings                                       |
| Collections         | Curated book lists                                           |
| Jobs                | Contributor role definitions (Author, Photographer, etc.)    |
| Locations           | Geographic places via Google Places                          |
| Features            | Homepage featured books                                      |
| Featured Profiles   | Homepage featured profiles                                   |
| FAQs                | Frequently asked questions                                   |
| Links               | External book purchase links                                 |
| Verification Tokens | Email verification tokens                                    |

---

## Functional Requirements

This section describes all custom functionality that must be replicated in Payload, expressed as business requirements.

### 1. Automatic Slug Generation

**Requirement:** Several resources use URL-friendly slugs derived from their display name. Slugs must be automatically generated when a record is created, and regenerated when the name/title changes.

| Resource    | Source Field  | Slug Behavior                             |
| ----------- | ------------- | ----------------------------------------- |
| Books       | `title`       | Include random hash suffix for uniqueness |
| Profiles    | `name`        | Include random hash suffix                |
| Publishers  | `name`        | Include random hash suffix                |
| Tags        | `name`        | No hash suffix                            |
| Tag Groups  | `name`        | No hash suffix                            |
| Collections | `title`       | No hash suffix                            |
| Locations   | `displayText` | Include random hash suffix                |

---

### 2. Image Upload and Management

**Requirement:** Images are stored in Cloudflare R2 and managed through the admin. Different resources have different image types with specific storage paths.

| Resource   | Image Type | Storage Path Pattern            | Single/Multiple |
| ---------- | ---------- | ------------------------------- | --------------- |
| Books      | Cover      | `books/{bookId}/cover`          | Single          |
| Books      | Previews   | `books/{bookId}/previews`       | Multiple        |
| Profiles   | Avatar     | `profile-avatars/{profileId}`   | Single          |
| Publishers | Logo       | `publisher-logos/{publisherId}` | Single          |

**Additional Requirements:**

- When an image is uploaded, detect and store its dimensions
- When a resource is deleted, its associated images must be deleted from R2
- When a book cover is uploaded/changed, its color palette must be regenerated (via background job)
- Images should display as thumbnails in list views and be uploadable in edit views

---

### 3. Book Color Palette

**Requirement:** Books have a background color and a palette of 3 colors extracted from their cover image. These colors are stored in HSL format in the database but should be displayed and editable as color pickers in the admin.

| Field                                    | Storage Format         | Admin Display   |
| ---------------------------------------- | ---------------------- | --------------- |
| `backgroundColor`                        | HSL object `{h, s, l}` | Color picker    |
| `palette[0]`, `palette[1]`, `palette[2]` | Array of color strings | 3 color pickers |

**Additional Requirement:** When the cover image changes, a background job automatically extracts and updates these colors. There should also be a bulk action to regenerate palettes for all books missing palette data.

---

### 4. Book Publishing Workflow

**Requirement:** Books have a status field (`draft`, `inReview`, `published`). Admins need an easy way to publish books.

**Publish Action Requirements:**

1. Set book status to `published`
2. If the book was submitted by a user (source = `submitted`, status was `inReview`):
   - Send the submitter an email notification that their submission was published
3. Refresh the cached book page on the frontend

---

### 5. Adding Collaborators to Books

**Requirement:** Admins need to add contributors (profiles) to books with a specific job role. The interface should:

1. Allow searching for existing profiles by name
2. Allow creating a new profile inline if one doesn't exist
3. Select a job role from the Jobs collection
4. Optionally mark the contribution as "Assistant" (e.g., "Assistant Food Stylist")

**Edge Cases:**

- If the same profile is already added with the same job, show an error
- When a new profile is created, auto-generate its slug from the name

---

### 6. User Access Approval

**Requirement:** New users sign up with a `waitlist` role. Admins need to approve these users to grant them access.

**Approve Action Requirements:**

1. Change user role from `waitlist` to `user`
2. Send the user an email notification that they've been approved

---

### 7. Claim Approval

**Requirement:** Users can claim ownership of a profile (to edit their own author page). Claims have a state: Pending, Approved, or Cancelled (derived from `approvedAt` and `cancelledAt` timestamps).

**Approve Action Requirements:**

1. Connect the claiming user to the profile (set `profile.userId`)
2. Set `claim.approvedAt` to current timestamp
3. Send the user an email notification that their claim was approved
4. Refresh the profile page on the frontend

**Display Requirement:** Show a computed "State" field in the list view (Pending/Approved/Cancelled) based on timestamps.

---

### 8. Profile Homepage Featuring

**Requirement:** Admins can feature profiles on the homepage with a single click.

**Feature Action Requirements:**

1. Create or update a `FeaturedProfile` record linked to the profile
2. Refresh the homepage on the frontend

---

### 9. Adding Locations to Profiles

**Requirement:** Profiles can be associated with locations (cities, countries). Locations must be created via Google Places search, not manually entered.

**Add Location Flow:**

1. Admin clicks "Add Location" on a profile
2. Search input appears with autocomplete from Google Places API
3. Admin selects a location from the suggestions
4. System creates or finds the location record using the Google Place ID
5. Location is linked to the profile

**Location Creation:** When a new location is created from Google Places:

- Store the Place ID, display text, country, region, latitude, longitude
- Auto-generate slug from display text
- Direct creation of locations (bypassing Google Places) should be blocked

---

### 10. Contribution Display

**Requirement:** In the contributions list view, show a human-readable display name format: `{Profile Name} [{Job} on {Book Title}]`

**Additional Requirement:** The database stores a `tag` field with value "Assistant" or null. Display this as a boolean "Assistant" checkbox in the admin.

---

### 11. Link Website Selection

**Requirement:** Book links have a `site` field that can be either a predefined website (from a list) or a custom website name.

**Admin Display:**

- Dropdown with predefined options: Bookshop.org, Edelweiss+, Amazon, Publisher website, etc.
- Text field for custom website if not in the dropdown
- Exactly one must be provided (dropdown OR custom text)

---

### 12. Verification Email Resend

**Requirement:** Admins can resend verification emails for pending verification tokens.

---

### 13. Frontend Cache Invalidation

**Requirement:** When content changes in the admin, the corresponding pages on the frontend must be refreshed (ISR revalidation).

| Resource Change                  | Pages to Revalidate                           |
| -------------------------------- | --------------------------------------------- |
| Book created/updated/deleted     | `/cookbooks/{slug}`, homepage                 |
| Profile updated/deleted          | `/people/{slug}`, `/authors/{slug}`, homepage |
| Publisher updated                | `/publishers/{slug}`                          |
| FAQ changed                      | `/frequently-asked-questions`                 |
| Feature/Featured Profile changed | Homepage                                      |

---

### 14. Default Values for New Books

**Requirement:** When creating a book through the admin:

- Status defaults to `published`
- Source is set to `admin`
- Title is trimmed of whitespace

---

### 15. Timestamp Updates

**Requirement:** All resources should have their `updatedAt` timestamp updated when modified through the admin.

---

### 16. Profile Metadata

**Requirement:** When a book is created or updated, all associated profiles (authors and contributors) should have their `mostRecentlyPublishedOn` date recalculated based on their latest published book.

---

## Authentication Requirements

**Requirement:** Only users with `role: 'admin'` in the existing Users table should be able to access the Payload admin panel.

**Approach:**

1. Configure Payload to use the existing `users` table for authentication
2. Set up access control that checks `user.role === 'admin'`
3. Regular users (role: `user` or `waitlist`) cannot access the admin at all

---

## Deployment Architecture

Deploy Payload as part of the existing Next.js web application:

```
/web
├── app/
│   ├── (frontend)/     # Existing frontend routes
│   └── (payload)/      # Payload admin routes
│       └── admin/
│           └── [[...segments]]/
│               └── page.tsx
├── payload.config.ts
└── collections/
```

**Admin URL:** `https://booksaboutfood.info/admin` (or `localhost:5000/admin` in dev)

---

## Background Jobs Strategy

### MVP: Keep Inngest

For the initial migration, continue using Inngest for background jobs. Payload hooks will trigger Inngest events just as Forest Admin hooks do today.

**Current Inngest Jobs:**
| Job | Trigger | Description |
|-----|---------|-------------|
| `generate-palette` | `book.updated` (when cover changes) | Extracts colors from cover image |
| `email` | `jobs.email` | Sends templated emails |
| `send-verification` | `jobs.send-verification` | Sends verification emails |
| `clean-images` | Image deletion | Cleans up R2 storage |
| `convert-webp` | Image upload | Converts images to WebP |

### Future: Payload Jobs Queue

Payload 3.0 includes a built-in Jobs Queue. Migration would be straightforward since:

- Inngest functions → Payload tasks
- `inngest.send()` → `payload.jobs.queue()`
- Job logic is already isolated in `packages/jobs`

---

## Migration Phases

### Phase 1: Minimal Viable Admin

**Goal:** See Payload admin in browser at `/admin` with basic data display.

**Steps:**

1. Install Payload dependencies in `/web`
2. Create minimal `payload.config.ts`
3. Set up database adapter pointing to existing Postgres
4. Create stub collection configs for 2-3 simple collections (e.g., Tags, Jobs, FAQs)
5. Run `npm run dev` and verify admin loads at `localhost:5000/admin`

**Browser verification:**

- [ ] Admin panel loads without errors
- [ ] Can see list of Tags/Jobs/FAQs
- [ ] Can view individual records
- [ ] Data matches what's in the database

**STOP FOR REVIEW** before proceeding to Phase 2.

---

### Phase 2: All Collections (Read-Only)

**Goal:** All 17 collections visible in admin with correct fields and relationships.

**Steps:**

1. Add remaining collection configs with all fields
2. Set up relationships between collections
3. Configure admin display (useAsTitle, defaultColumns, etc.)
4. Temporarily set all collections to read-only

**Browser verification:**

- [ ] All 17 collections appear in sidebar
- [ ] Each collection shows correct fields
- [ ] Relationships display correctly (e.g., Book shows Publisher)
- [ ] List views show expected columns

**STOP FOR REVIEW** before proceeding to Phase 3.

---

### Phase 3: Authentication & Write Access

**Goal:** Admin-only access with full CRUD operations.

**Steps:**

1. Configure Payload auth to use existing users table
2. Implement admin role check in access control
3. Enable write operations on all collections
4. Test login/logout flow

**Browser verification:**

- [ ] Can log in with admin user credentials
- [ ] Non-admin users cannot access `/admin`
- [ ] Can create, update, delete records
- [ ] Changes persist to database

**STOP FOR REVIEW** before proceeding to Phase 4.

---

### Phase 4: Image Uploads

**Goal:** Image upload working with R2 storage.

**Steps:**

1. Configure S3 storage adapter for R2
2. Set up upload fields on Books (cover, previews), Profiles (avatar), Publishers (logo)
3. Configure storage paths per resource type
4. Test upload, display, and deletion

**Browser verification:**

- [ ] Can upload images through admin
- [ ] Images display as thumbnails in list/edit views
- [ ] Images stored in correct R2 paths
- [ ] Deleting a record cleans up associated images

**STOP FOR REVIEW** before proceeding to Phase 5.

---

### Phase 5: Slug Generation & Timestamps

**Goal:** Automatic slug generation and timestamp updates.

**Steps:**

1. Implement beforeChange hooks for slug generation
2. Add timestamp update hooks
3. Test create and update flows

**Browser verification:**

- [ ] Creating a Book auto-generates slug from title
- [ ] Updating a Book title regenerates slug
- [ ] All resources have correct slugs per the requirements table
- [ ] `updatedAt` updates on save

**STOP FOR REVIEW** before proceeding to Phase 6.

---

### Phase 6: Custom Field Components

**Goal:** Color pickers, computed fields, and custom displays.

**Steps:**

1. Create color picker components for book palette fields
2. Implement computed State field for Claims
3. Implement computed DisplayName for Contributions
4. Implement Assistant boolean field for Contributions
5. Implement Link website dropdown/text combo

**Browser verification:**

- [ ] Color pickers display and save correctly (HSL conversion works)
- [ ] Claims show Pending/Approved/Cancelled state
- [ ] Contributions show formatted display name
- [ ] Links show dropdown with custom text fallback

**STOP FOR REVIEW** before proceeding to Phase 7.

---

### Phase 7: Custom Actions

**Goal:** All admin actions working.

**Steps:**

1. Implement Publish action for Books
2. Implement Approve actions for Users and Claims
3. Implement Feature on Homepage for Profiles
4. Implement Add Collaborator for Books
5. Implement Add Location for Profiles (Google Places)
6. Implement Resend Verification for Tokens
7. Implement Generate Missing Palettes bulk action

**Browser verification:**

- [ ] Each action executes successfully
- [ ] Emails sent where applicable (check Inngest dashboard)
- [ ] Database updated correctly after each action

**STOP FOR REVIEW** before proceeding to Phase 8.

---

### Phase 8: Cache Invalidation & Background Jobs

**Goal:** Frontend cache updates and Inngest integration.

**Steps:**

1. Implement afterChange/afterDelete hooks to call revalidatePath
2. Implement Inngest triggers for palette generation
3. Test cache invalidation end-to-end

**Browser verification:**

- [ ] Editing a book and viewing the frontend shows updated content
- [ ] Cover image changes trigger palette regeneration
- [ ] Inngest dashboard shows job executions

**STOP FOR REVIEW** before proceeding to Phase 9.

---

### Phase 9: Final Testing & Cutover

**Goal:** Complete migration and decommission Forest Admin.

**Steps:**

1. Full user acceptance testing with team
2. Document any workflow differences
3. Deploy to production
4. Run both admins in parallel for verification period
5. Decommission Forest Admin
   - Remove dependencies from `/admin`
   - Delete Heroku deployment
   - Cancel Forest Admin subscription

**Verification:**

- [ ] Team has tested all workflows
- [ ] No critical issues found
- [ ] Forest Admin fully removed

---

## Data Considerations

### Prisma Schema Integration

Payload will use the existing Prisma schema from `packages/database`:

1. Configure Payload's database adapter to work with the existing tables
2. Keep using Prisma for frontend queries (no changes needed)
3. Payload operates on the same tables as the rest of the application

**Note:** Payload may create some internal tables for its own use (e.g., preferences). These won't conflict with existing tables.

### No Data Migration Required

Since Payload will use the same database tables, no data migration is needed. The admin simply provides a new interface to the existing data.

---

## Open Questions

1. **Payload version:** Use latest stable 3.x release?
2. **Database adapter:** Native Postgres adapter or Prisma adapter?
3. **Custom components:** Build from scratch or use existing Payload plugins?

---

## References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload 3.0 Announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)
- [Payload Hooks Overview](https://payloadcms.com/docs/hooks/overview)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)
- [Payload S3 Storage Adapter](https://payloadcms.com/docs/upload/storage-adapters)
- [Payload Jobs Queue](https://payloadcms.com/docs/jobs-queue/overview)
