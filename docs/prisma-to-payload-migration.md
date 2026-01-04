# Prisma to Payload CMS Migration

**Status:** Model Layer Refactored ✅ - Ready for Phase 5 (Complex CRUD)

## Executive Summary

Migrating from Prisma ORM to Payload CMS as the primary data layer, with a simplified architecture that merges the `packages/core` package into `web/src/core`.

**Key Changes:**

- ✅ Merged `packages/core` into `web/src/core`
- 🔄 Migrating all services from Prisma to Payload API
- 📋 Replacing NextAuth Prisma adapter with Payload adapter
- 📋 Migrating Inngest jobs to Payload's job system

---

## Phase 0: Merge Core into Web ✅ COMPLETE

**Goal:** Simplify architecture by moving `packages/core` into `web/src/core`

**Rationale:**

- Admin package (Koa.js + Forest Admin) is being replaced by Payload CMS
- Only consumer of core will be web (future API reuse would be through HTTP)
- Eliminates monorepo complexity and import overhead
- Payload is tightly integrated with Next.js - simpler when colocated

### Completed Tasks

1. ✅ **Moved core files** - Copied `packages/core/*` to `web/src/core/`
2. ✅ **Updated dependencies** - Added core's dependencies to `web/package.json`:
   - `@aws-sdk/client-s3`, `@inngest/middleware-sentry`
   - `inngest`, `mime-types`, `neat-csv`, `plaiceholder`
   - `@types/mime-types`
3. ✅ **Updated imports** - Replaced all 203 `@books-about-food/core` imports with `src/core`
4. ✅ **Fixed payload config imports** - Updated to use `@payload-config` alias
5. ✅ **Cleaned up payload duplication** - Removed `web/src/core/payload/`, kept `web/src/payload/`
6. ✅ **Deleted old package** - Removed `packages/core` directory completely
7. ✅ **Fixed type errors** - Resolved import paths and type mismatches

### Final Structure

```
web/src/
├── core/                      # Business logic (moved from packages/core)
│   ├── services/              # Service layer with Payload context
│   ├── models/                # Domain models
│   ├── policies/              # Authorization logic
│   ├── gateways/              # External API integrations
│   ├── jobs/                  # Job definitions
│   ├── types.ts               # Shared types
│   └── utils/                 # Utilities (includes payload.ts)
├── payload/                   # Payload CMS configuration
│   ├── collections/           # Payload collections
│   ├── components/            # Payload UI components
│   ├── config/                # DB, storage, editor config
│   ├── migrations/            # Data migrations
│   └── plugins/               # Payload plugins
├── payload.config.ts          # Main Payload config
├── app/                       # Next.js App Router
├── components/                # React components
└── ...
```

---

## Phase 1: Infrastructure - Payload Context Injection ✅ COMPLETE

**Goal:** Update service layer to accept Payload instance via context

### Completed Changes

1. ✅ Created `web/src/core/services/utils/payload.ts` - Payload client singleton
2. ✅ Updated `web/src/core/services/base.ts` - Added context pattern:
   ```typescript
   export type ServiceContext = { payload: Payload }
   export type AuthedServiceContext = ServiceContext & { user: User }
   ```
3. ✅ Created `web/src/core/services/utils/payload-depth.ts` - Depth constants
4. ✅ Updated all 58+ service signatures:
   - `Service`: `async (input, { payload }) => ...`
   - `AuthedService`: `async (input, { payload, user }) => ...`

### Key Files Modified

- `web/src/core/services/base.ts` - Context types and base classes
- `web/src/core/services/utils/payload.ts` - Payload singleton
- `web/src/core/services/utils/payload-depth.ts` - Depth configuration
- All service files in `web/src/core/services/` - Updated signatures

---

## Phase 2: Simple CRUD Services ✅ COMPLETE

**Goal:** Migrate ~15 simple read/write services to Payload API

### Migrated Services (15 total) ✅

**Read-only (6 services):**

- ✅ `fetchJobs` - Simple job lookup with optional search
- ✅ `fetchTags` - Tags filtered by search, admin status, and published books
- ✅ `fetchTagGroups` - Tag groups with nested tags
- ✅ `fetchFeatures` - Featured books with date filtering
- ✅ `fetchLocations` - Locations with optional profile filter
- ✅ `fetchLocationFilterOption` - Single location filter option by ID

**Single entity fetches (6 services):**

- ✅ `fetchBook` - Book by slug with full relationships (FULL_BOOK_DEPTH)
- ✅ `fetchProfile` - Profile by slug with location relationships
- ✅ `fetchPublisher` - Publisher by slug with logo and imprints
- ✅ `fetchCollection` - Collection by slug (published only)
- ✅ `fetchPost` - Post by slug (admin only, with user context)
- ✅ `fetchClaim` - User claim for profile (authed, with user context)

**Simple create/update (3 services):**

- ✅ `updateFavourite` - Upsert/delete user favourites (authed, with user context)
- ✅ `toggleContributionVisibility` - Bulk update contribution visibility
- ✅ `updateLinks` - Replace all book links (authed, with user context)

### Deferred Services

**Complex location service:**

- 📋 `fetchLocationFilterOptions` - Uses Prisma `_relevance` for full-text search (deferred to Phase 6)

### Key Implementation Details

**User Context in AuthedServices:**
All AuthedService Payload calls now include `user` parameter for proper access control:

```typescript
await payload.find({ collection: '...', where: {...}, user })
await payload.create({ collection: '...', data: {...}, user })
await payload.update({ collection: '...', id: '...', data: {...}, user })
await payload.delete({ collection: '...', id: '...', user })
```

### Migration Pattern

```typescript
// BEFORE (Prisma)
export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, _ctx) => {
    const book = await prisma.book.findUnique({
      where: { slug },
      include: bookIncludes
    })
    return book ? new Book(book) : null
  }
)

// AFTER (Payload)
export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, { payload }) => {
    const { docs } = await payload.find({
      collection: 'books',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: BOOK_DEPTH
    })
    return docs[0] ? new Book(docs[0]) : null
  }
)
```

### Payload Query Patterns

**Find single:**

```typescript
const { docs } = await payload.find({
  collection: 'books',
  where: { slug: { equals: slug } },
  limit: 1,
  depth: BOOK_DEPTH
})
```

**Find many:**

```typescript
const { docs } = await payload.find({
  collection: 'tags',
  where: { group: { equals: groupSlug } },
  sort: 'name',
  depth: TAG_DEPTH
})
```

**Create:**

```typescript
const newBook = await payload.create({
  collection: 'books',
  data: { title, slug, status: 'draft' },
  depth: BOOK_DEPTH
})
```

**Update:**

```typescript
const updated = await payload.update({
  collection: 'books',
  id: bookId,
  data: { status: 'published' },
  depth: BOOK_DEPTH
})
```

---

## Phase 3: Paginated List Services ✅ COMPLETE

**Goal:** Migrate ~10 paginated list services to use Payload's built-in pagination

### Migrated Services (6 total) ✅

**Paginated list services:**

- ✅ `fetchPublishers` - Publishers with search filter, handles `perPage: 'all'` case
- ✅ `fetchProfiles` - Profiles with complex filters (location, job, search, onlyPublished, withAvatar)
- ✅ `fetchCollections` - Collections filtered by publisher slug and featured status
- ✅ `fetchFavourites` - User favourites with profile depth (AuthedService)
- ✅ `fetchMemberships` - Publisher memberships with authorization check (AuthedService)
- ✅ `fetchInvitations` - Pending publisher invitations with authorization check (AuthedService)

### Deferred Services

**Remaining paginated services:**

- 📋 `fetchContributions` - Deferred to Phase 5 (complex relationships)
- 📋 `fetchBooks` - Deferred to Phase 6 (uses raw SQL for color matching)

### Key Implementation Details

**Pagination Differences:**

- Payload uses **1-indexed** pages (1, 2, 3...), Prisma used 0-indexed
- Convert: `page: page + 1` when calling Payload
- Use `pagination: false` (not `limit: 0`) to fetch all documents
- Payload returns rich metadata: `{ docs, totalDocs, totalPages, page, limit }`

**"Get All" Pattern:**

```typescript
if (perPage === 'all') {
  const result = await payload.find({
    collection: 'publishers',
    where,
    pagination: false, // Disable pagination to get all
    sort: 'name',
    depth: PUBLISHER_DEPTH
  })
  return {
    publishers: result.docs.map((p) => new Publisher(p)),
    total: totalResult.totalDocs,
    filteredTotal: result.totalDocs,
    perPage: 'all' as const
  }
}
```

**Total Count Strategy:**

For services that return both filtered and unfiltered totals, fetch unfiltered count separately:

```typescript
// Get total count (unfiltered)
const totalResult = await payload.find({
  collection: 'publishers',
  limit: 0,
  depth: 0
})
```

**Complex Filters:**

Services like `fetchProfiles` required converting complex Prisma filters to Payload's `Where` syntax:

```typescript
const where: Where = {
  and: [{ name: { not_equals: '' } }]
}

if (onlyPublished) {
  where.and!.push({
    or: [
      { 'authoredBooks.status': { equals: 'published' } },
      { 'contributions.book.status': { equals: 'published' } }
    ]
  })
}
```

**Authorization in Paginated Services:**

AuthedServices like `fetchMemberships` and `fetchInvitations` maintain authorization checks:

```typescript
// Verify user is a member before returning data
const isMember = memberships.some((m) => {
  const userId = typeof m.user === 'object' ? m.user.id : m.user
  return userId === user.id
})
if (!isMember) {
  throw new AppError('Forbidden', 'You are not a member of this publisher')
}
```

### Migration Pattern

```typescript
// BEFORE (Prisma with manual pagination)
export const fetchPublishers = new Service(
  z.object({ page: z.number(), perPage: z.number() }),
  async ({ page, perPage }, _ctx) => {
    const [publishers, total] = await Promise.all([
      prisma.publisher.findMany({
        skip: page * perPage,
        take: perPage,
        include: publisherIncludes
      }),
      prisma.publisher.count()
    ])

    return {
      publishers: publishers.map((p) => new Publisher(p)),
      total,
      totalPages: Math.ceil(total / perPage)
    }
  }
)

// AFTER (Payload with built-in pagination)
export const fetchPublishers = new Service(
  z.object({ page: z.number(), perPage: z.number() }),
  async ({ page, perPage }, { payload }) => {
    const result = await payload.find({
      collection: 'publishers',
      limit: perPage,
      page: page + 1, // Payload is 1-indexed!
      depth: PUBLISHER_DEPTH
    })

    return {
      publishers: result.docs.map((p) => new Publisher(p)),
      total: result.totalDocs,
      totalPages: result.totalPages
    }
  }
)
```

**Key Differences:**

- Payload pagination is 1-indexed (page 1, 2, 3...), Prisma was 0-indexed
- Payload returns `{ docs, totalDocs, totalPages, page, limit }`
- No need for separate count query

---

## Phase 3.5: Model Layer Refactoring ✅ COMPLETE

**Goal:** Refactor model constructors to use Payload types directly with runtime validation

### Completed Changes

1. ✅ **Created validation utilities** - `web/src/core/models/utils/payload-validation.ts`:

   - `optionalPopulated<T>()` - validates optional relationships are populated
   - `requirePopulated<T>()` - validates required relationships are populated
   - `requirePopulatedArray<T>()` - validates array relationships are populated
   - `optionalPopulatedArray<T>()` - validates optional arrays
   - `extractId()` - extracts IDs from relationships (string | object)
   - `extractIds()` - extracts IDs from arrays

2. ✅ **Refactored 12 model constructors** to:

   - Import Payload types directly instead of using types.ts
   - Use validation utilities instead of manual validation
   - Define type aliases inline (e.g., `type ProfileAttrs = PayloadProfile & {...}`)

3. ✅ **Simplified types.ts** from ~200 lines to ~40 lines:
   - Removed complex generic utilities (`Resolved`, `ResolvedArray`, `ResolvedModel`, etc.)
   - Removed unused type aliases (now defined inline in models)
   - Kept only types used by external files: `FullBookAttrs`, `BookAttrs`, `BookResult`, `BookVote`, `TagGroup`
   - Added comment indicating legacy file for backward compatibility

### Files Modified

**Model files refactored (12 total):**

- `book.ts` - Uses `optionalPopulated`, `requirePopulatedArray`, `extractId`
- `full-book.ts` - Uses `optionalPopulated`, `requirePopulatedArray`
- `publisher.ts` - Uses `optionalPopulated`, `requirePopulatedArray`, `extractIds`
- `profile.ts` - Uses `optionalPopulated`, `requirePopulatedArray`, `extractId`, `extractIds`
- `membership.ts` - Uses `requirePopulated`
- `collection.ts` - Uses `requirePopulatedArray`, `extractId`
- `invitation.ts` - Uses `requirePopulated`
- `contribution.ts` - Uses `requirePopulated`
- `location.ts` - Imports `PayloadLocation` directly
- `post.ts` - Imports `PayloadPost` directly
- `image.ts` - Imports `PayloadImage` directly
- `user.ts` - Already using Payload types ✓

**Type files:**

- `types.ts` - Reduced from ~200 to ~40 lines
- `utils/payload-validation.ts` - New utilities file

### Key Benefits

- **DRY Code:** Validation logic consolidated into reusable utilities
- **Direct Imports:** Models import Payload types directly, no unnecessary abstraction
- **Type Safety:** Validation utilities properly narrow types with generics
- **Clear Errors:** Descriptive error messages indicate which field needs depth
- **Maintainable:** Each model file is self-contained with inline type definitions

### Example Pattern

```typescript
// BEFORE
if (attrs.avatar && typeof attrs.avatar === 'string') {
  throw new Error('Profile.avatar must be populated...')
}
this.avatar = attrs.avatar
  ? new Image(attrs.avatar as ImageAttrs, `Avatar for ${attrs.name}`, true)
  : undefined

// AFTER
const avatar = optionalPopulated(attrs.avatar, 'Profile.avatar')
this.avatar = avatar
  ? new Image(avatar, `Avatar for ${attrs.name}`, true)
  : undefined
```

---

## Phase 4: NextAuth Adapter Migration 📋 PENDING

**Goal:** Replace Prisma adapter with Payload adapter for NextAuth.js

### Approach

Vendor the [PayloadAdapter](https://github.com/CrawlerCode/payload-authjs/blob/main/packages/payload-authjs/src/authjs/PayloadAdapter.ts) into `web/src/lib/auth/payload-adapter.ts`

### Files to Modify

1. `/web/src/lib/auth/payload-adapter.ts` (new file - vendor from GitHub)
2. `/web/src/auth.ts` - Update adapter and JWT callback

### Implementation

```typescript
// BEFORE
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@books-about-food/database'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma)
  // ...
})

// AFTER
import { PayloadAdapter } from '@/lib/auth/payload-adapter'
import { getPayloadClient } from 'src/core/services/utils/payload'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PayloadAdapter(getPayloadClient),
  // ...
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }

      // Fetch fresh user data with memberships
      if (token.userId) {
        const payload = await getPayloadClient()
        const dbUser = await payload.findByID({
          collection: 'users',
          id: token.userId,
          depth: 1 // Include memberships
        })

        if (dbUser) {
          token.role = dbUser.role
          token.memberships =
            dbUser.memberships?.map((m) => m.publisherId) || []
        }
      }

      return token
    }
  }
})
```

---

## Phase 5: Complex CRUD Services ✅ COMPLETE

**Goal:** Migrate ~15 services with complex relationships and nested operations

### Completed Services (14 total) ✅

**Upsert patterns (2 services):**

- ✅ `findOrCreateLocation` - Upsert location with Google Places API integration
- ✅ `findOrCreateProfile` - Upsert profile with ambiguity handling

**Book management (4 services):**

- ✅ `updateBook` - Update/create book with nested relationships
- ✅ `createBook` - Create book from Google Books API with image upload
- ✅ `updateContributors` - Manage book contributors with job upserts

**Membership/Invitation (6 services):**

- ✅ `createInvite` - Create publisher invitation with email
- ✅ `acceptInvite` - Accept invitation and create membership
- ✅ `destroyMembership` - Delete membership with authorization
- ✅ `deleteInvite` - Delete invitation (owner or admin)
- ✅ `resendInvite` - Resend invitation email
- ✅ `updateMembership` - Update membership role

**Profile/Publisher (2 services):**

- ✅ `updateProfile` - Update profile with locations
- ✅ `updatePublisher` - Update publisher details

**Other:**

- ✅ `fetchContributions` - Fetch contributions for profile/book

### Example Pattern: createBook

```typescript
export const createBook = new AuthedService(
  z.object({
    title: z.string(),
    authorIds: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional()
  }),
  async ({ title, authorIds, tags }, { payload, user }) => {
    const book = await payload.create({
      collection: 'books',
      data: {
        title,
        slug: slugify(title),
        status: 'draft',
        submitter: user.id,
        authors: authorIds, // Relationship IDs
        tags: tags, // Relationship IDs
        source: 'submitted'
      },
      depth: FULL_BOOK_DEPTH
    })

    return new FullBook(book)
  }
)
```

### Patterns for Complex Operations

**Upsert pattern:**

```typescript
const existing = await payload.find({
  collection: 'locations',
  where: { placeId: { equals: placeId } },
  limit: 1
})

if (existing.docs[0]) {
  return existing.docs[0]
}

return await payload.create({
  collection: 'locations',
  data: { placeId, displayText, slug }
})
```

**Nested relationship updates:**

```typescript
await payload.update({
  collection: 'books',
  id: bookId,
  data: {
    authors: authorIds, // Replace relationships
    contributions: contributionIds // Replace relationships
  }
})
```

---

## Phase 6: Raw SQL Services 📋 PENDING

**Goal:** Migrate services using raw SQL to Payload's Drizzle integration

### Critical Files

- `web/src/core/services/books/fetch-books.ts` - Complex color matching, lateral joins
- `web/src/core/services/books/fetch-similar-books.ts` - Tag-based similarity

### Strategy

Use Payload's underlying Drizzle client with `sql` template helpers:

```typescript
import { sql } from 'drizzle-orm'

export const fetchBooks = new Service(
  fetchBooksSchema,
  async (filters, { payload }) => {
    const db = payload.db.drizzle
    const { books, profiles } = payload.db.tables

    // Type-safe raw SQL for color matching
    const colorDistance = sql<number>`
      sqrt(
        power((${books.backgroundColorHsl}->>'h')::float - ${targetHue}, 2) +
        power((${books.backgroundColorHsl}->>'s')::float - ${targetSat}, 2)
      )
    `.as('color_distance')

    const results = await db
      .select({
        id: books.id,
        title: books.title,
        colorDistance
      })
      .from(books)
      .where(sql`${books.status} = 'published'`)
      .orderBy(colorDistance)
      .limit(filters.limit)

    return results
  }
)
```

### Setup Required

```bash
# Generate Drizzle schema from Payload collections
npx payload generate:db-schema
```

---

## Phase 7: Migrate Inngest to Payload Jobs 📋 PENDING

**Goal:** Replace Inngest with Payload's built-in job system

### Current Jobs to Migrate

| Inngest Job          | Trigger                               | Payload Equivalent         |
| -------------------- | ------------------------------------- | -------------------------- |
| `generate-palette`   | `book.updated` with coverImageChanged | Payload hook + job queue   |
| `convert-webp`       | `book.updated` with coverImageChanged | Payload hook + job queue   |
| `clean-images`       | Cron: `0 9 * * 1`                     | Payload scheduled task     |
| `send-email`         | On-demand                             | Payload job queue          |
| `send-verification`  | On-demand                             | Payload job queue          |
| `send-vote-reminder` | `votes.created` with delay            | Payload hook + delayed job |

### Payload Jobs Configuration

Add to `web/src/payload.config.ts`:

```typescript
export default buildConfig({
  // ... other config
  jobs: {
    tasks: [
      {
        slug: 'generate-palette',
        handler: async ({ input, req }) => {
          const book = await req.payload.findByID({
            collection: 'books',
            id: input.bookId
          })

          // Generate palette using Vibrant
          const palette = await generatePalette(book.coverImage.url)

          await req.payload.update({
            collection: 'books',
            id: input.bookId,
            data: { palette, backgroundColor: palette.dominant }
          })
        },
        inputSchema: [{ name: 'bookId', type: 'text', required: true }]
      },
      {
        slug: 'clean-images',
        schedule: [{ cron: '0 9 * * 1' }], // Mondays 9am
        handler: async ({ req }) => {
          // Find orphaned images and delete
          const images = await req.payload.find({
            collection: 'images',
            where: {
              and: [
                { coverImageBooks: { exists: false } },
                { previewImageBooks: { exists: false } }
              ]
            }
          })

          await Promise.all(
            images.docs.map((img) =>
              req.payload.delete({ collection: 'images', id: img.id })
            )
          )
        }
      }
    ],
    autoRun: [{ cron: '* * * * *', limit: 10 }] // Process every minute
  }
})
```

### Queue Jobs from Hooks

```typescript
// In afterChange hook
const Books: CollectionConfig = {
  slug: 'books',
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const coverChanged = doc.coverImage !== previousDoc?.coverImage

        if (coverChanged) {
          await req.payload.jobs.queue({
            task: 'generate-palette',
            input: { bookId: doc.id }
          })
        }
      }
    ]
  }
}
```

### Migration Steps

1. Define all tasks in Payload config
2. Update trigger points (hooks instead of `inngest.send()`)
3. Remove `web/src/core/jobs` directory
4. Remove `/admin/inngest` directory
5. Remove Inngest dependencies

---

## Testing Strategy

### After Each Phase

1. **Compare outputs:** Verify Prisma vs Payload return same data for identical inputs
2. **Test in browser:** Manually test affected features in local dev
3. **Type checking:** Run `npx tsc --noEmit` to catch type errors
4. **Preview deployment:** Validate changes in preview environment

### Phase-Specific Testing

**Phase 2-5 (Services):**

- Test each migrated service individually
- Compare response shapes between Prisma and Payload versions
- Verify relationships are properly loaded

**Phase 4 (Auth):**

- Test all auth flows (login, logout, session)
- Verify JWT callback works with Payload
- Check role and membership data in session

**Phase 6 (Raw SQL):**

- Test `fetchBooks` with various filters
- Verify color matching accuracy
- Compare performance with Prisma version

**Phase 7 (Jobs):**

- Trigger each job manually
- Verify cron schedules fire correctly
- Check job queue processing

---

## Success Criteria

- ✅ Phase 0: Core merged into web, all imports updated
- ✅ Phase 1: Service infrastructure ready for Payload
- ✅ Phase 2: Simple CRUD services migrated (15 services)
- ✅ Phase 3: Paginated services migrated (6 services)
- ✅ Phase 3.5: Model layer refactored with validation utilities
- 📋 Phase 4: Auth adapter migrated
- 📋 Phase 5: Complex CRUD services migrated
- 📋 Phase 6: Raw SQL services migrated
- 📋 Phase 7: Jobs migrated to Payload
- 📋 No TypeScript errors
- 📋 Dev server runs successfully
- 📋 All features working in preview deployment
- 📋 Prisma dependencies removed

---

## Notes

- Generated files (.next/types, importMap.js) will have type errors until dev server runs
- Payload uses 1-indexed pagination (unlike Prisma's 0-indexed)
- Depth parameter controls relationship loading (similar to Prisma includes)
- Use `@payload-config` alias for importing payload config
- Services use `src/core/*` imports (not `@/core/*` - no @ aliases used)

---

## Progress Log

### 2026-01-02

- ✅ **Phase 0 Complete:** Merged packages/core into web/src/core, fixed all imports and type errors
- ✅ **Phase 1 Complete:** Service infrastructure ready with Payload context injection
- ✅ **Phase 2 Complete:** Migrated 15 simple CRUD services to Payload API
  - Read-only services: 6 services
  - Single-entity fetches: 6 services
  - Simple create/update: 3 services
  - Added user context to all AuthedService Payload calls
  - Deferred: `fetchLocationFilterOptions` (uses Prisma `_relevance`, moved to Phase 6)

### 2026-01-03

- ✅ **Phase 3 Complete:** Migrated 6 paginated list services to Payload API

  - Paginated services: `fetchPublishers`, `fetchProfiles`, `fetchCollections`, `fetchFavourites`, `fetchMemberships`, `fetchInvitations`
  - Handled `perPage: 'all'` cases with `pagination: false`
  - Converted complex Prisma filters to Payload `Where` syntax
  - Deferred: `fetchContributions`, `fetchBooks` (moved to Phase 5 and 6)

- ✅ **Phase 3.5 Complete:** Model layer refactoring

  - Created validation utilities in `payload-validation.ts`
  - Refactored 12 model constructors to use Payload types directly
  - Simplified `types.ts` from ~200 to ~40 lines
  - All models now import Payload types directly with runtime validation

- 🔄 **Phase 5 In Progress:** Complex CRUD services migration
  - Migrated 10 services: upsert patterns, book management, membership/invitation services
  - Services: `findOrCreateLocation`, `findOrCreateProfile`, `updateBook`, `createBook`, `createInvite`, `acceptInvite`, `destroyMembership`, `deleteInvite`, `resendInvite`, `updateMembership`
  - Remaining: `updateContributors`, `updateProfile`, `updatePublisher`, `fetchContributions`

**Last Updated:** 2026-01-03
