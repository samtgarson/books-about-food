# Prisma to Payload CMS Migration

**Status:** Phase 2 Complete ✅ - Ready for Phase 3

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

## Phase 3: Paginated List Services 📋 PENDING

**Goal:** Migrate ~10 paginated list services to use Payload's built-in pagination

### Target Services

- `fetchPublishers`, `fetchProfiles`, `fetchCollections`
- `fetchFavourites`, `fetchMemberships`, `fetchInvitations`
- `fetchContributions`, `fetchBooks` (list view)

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

## Phase 5: Complex CRUD Services 📋 PENDING

**Goal:** Migrate ~15 services with complex relationships and nested operations

### Target Services

**Book management:**

- `createBook`, `updateBook`, `updateContributors`

**Membership/Invitation:**

- `createInvite`, `acceptInvite`, `resendInvite`, `deleteInvite`
- `destroyMembership`, `updateMembership`

**Profile/Publisher:**

- `updateProfile`, `findOrCreateProfile`, `updatePublisher`
- `findOrCreateLocation`

### Example: createBook

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
- 📋 Phase 2: Simple CRUD services migrated
- 📋 Phase 3: Paginated services migrated
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

**Last Updated:** 2026-01-02
