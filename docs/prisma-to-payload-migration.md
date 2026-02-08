# Prisma to Payload CMS Migration

**Status:** Phases 0-6 Complete ✅ - Ready for Phase 7 (Inngest to Payload Jobs) or Phase 8 (Cleanup Remaining Prisma Services)

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
   export type ServiceContext = { payload: Payload };
   export type AuthedServiceContext = ServiceContext & { user: User };
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

- ✅ `fetchLocationFilterOptions` - Migrated to generate options dynamically from locations collection (no longer needs `_relevance`)

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
      include: bookIncludes,
    });
    return book ? new Book(book) : null;
  },
);

// AFTER (Payload)
export const fetchBook = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, { payload }) => {
    const { docs } = await payload.find({
      collection: "books",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: BOOK_DEPTH,
    });
    return docs[0] ? new Book(docs[0]) : null;
  },
);
```

### Payload Query Patterns

**Find single:**

```typescript
const { docs } = await payload.find({
  collection: "books",
  where: { slug: { equals: slug } },
  limit: 1,
  depth: BOOK_DEPTH,
});
```

**Find many:**

```typescript
const { docs } = await payload.find({
  collection: "tags",
  where: { group: { equals: groupSlug } },
  sort: "name",
  depth: TAG_DEPTH,
});
```

**Create:**

```typescript
const newBook = await payload.create({
  collection: "books",
  data: { title, slug, status: "draft" },
  depth: BOOK_DEPTH,
});
```

**Update:**

```typescript
const updated = await payload.update({
  collection: "books",
  id: bookId,
  data: { status: "published" },
  depth: BOOK_DEPTH,
});
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

- ✅ `fetchContributions` - Completed in Phase 5
- ✅ `fetchBooks` - Completed in Phase 6 (uses Drizzle for color matching)

### Key Implementation Details

**Pagination Differences:**

- Payload uses **1-indexed** pages (1, 2, 3...), Prisma used 0-indexed
- Convert: `page: page + 1` when calling Payload
- Use `pagination: false` (not `limit: 0`) to fetch all documents
- Payload returns rich metadata: `{ docs, totalDocs, totalPages, page, limit }`

**"Get All" Pattern:**

```typescript
if (perPage === "all") {
  const result = await payload.find({
    collection: "publishers",
    where,
    pagination: false, // Disable pagination to get all
    sort: "name",
    depth: PUBLISHER_DEPTH,
  });
  return {
    publishers: result.docs.map((p) => new Publisher(p)),
    total: totalResult.totalDocs,
    filteredTotal: result.totalDocs,
    perPage: "all" as const,
  };
}
```

**Total Count Strategy:**

For services that return both filtered and unfiltered totals, fetch unfiltered count separately:

```typescript
// Get total count (unfiltered)
const totalResult = await payload.find({
  collection: "publishers",
  limit: 0,
  depth: 0,
});
```

**Complex Filters:**

Services like `fetchProfiles` required converting complex Prisma filters to Payload's `Where` syntax:

```typescript
const where: Where = {
  and: [{ name: { not_equals: "" } }],
};

if (onlyPublished) {
  where.and!.push({
    or: [
      { "authoredBooks.status": { equals: "published" } },
      { "contributions.book.status": { equals: "published" } },
    ],
  });
}
```

**Authorization in Paginated Services:**

AuthedServices like `fetchMemberships` and `fetchInvitations` maintain authorization checks:

```typescript
// Verify user is a member before returning data
const isMember = memberships.some((m) => {
  const userId = typeof m.user === "object" ? m.user.id : m.user;
  return userId === user.id;
});
if (!isMember) {
  throw new AppError("Forbidden", "You are not a member of this publisher");
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
        include: publisherIncludes,
      }),
      prisma.publisher.count(),
    ]);

    return {
      publishers: publishers.map((p) => new Publisher(p)),
      total,
      totalPages: Math.ceil(total / perPage),
    };
  },
);

// AFTER (Payload with built-in pagination)
export const fetchPublishers = new Service(
  z.object({ page: z.number(), perPage: z.number() }),
  async ({ page, perPage }, { payload }) => {
    const result = await payload.find({
      collection: "publishers",
      limit: perPage,
      page: page + 1, // Payload is 1-indexed!
      depth: PUBLISHER_DEPTH,
    });

    return {
      publishers: result.docs.map((p) => new Publisher(p)),
      total: result.totalDocs,
      totalPages: result.totalPages,
    };
  },
);
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
if (attrs.avatar && typeof attrs.avatar === "string") {
  throw new Error("Profile.avatar must be populated...");
}
this.avatar = attrs.avatar
  ? new Image(attrs.avatar as ImageAttrs, `Avatar for ${attrs.name}`, true)
  : undefined;

// AFTER
const avatar = optionalPopulated(attrs.avatar, "Profile.avatar");
this.avatar = avatar
  ? new Image(avatar, `Avatar for ${attrs.name}`, true)
  : undefined;
```

---

## Phase 4: NextAuth Adapter Migration ✅ COMPLETE

**Goal:** Replace Prisma adapter with Payload adapter for NextAuth.js

### Completed Changes

1. ✅ **Migrated to payload-authjs package** - Using `getAuthjsInstance(payload)` instead of custom adapter
2. ✅ **Updated auth.ts** - Replaced NextAuth configuration with Payload integration
3. ✅ **Updated user collection** - Enhanced users collection with auth fields
4. ✅ **Updated accounts collection** - Configured for NextAuth compatibility
5. ✅ **Removed Prisma adapter dependencies** - Cleaned up auth-related imports

### Implementation

```typescript
// AFTER (using payload-authjs)
import { getPayload } from "payload";
import { getAuthjsInstance } from "payload-authjs";
import payloadConfig from "src/payload.config";

const payload = await getPayload({ config: payloadConfig });
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
  unstable_update,
} = getAuthjsInstance(payload);
```

**Key Benefits:**

- Native Payload integration with auth
- JWT callbacks handled by Payload
- Automatic user/account management through Payload collections
- Simplified auth configuration

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
    tags: z.array(z.string()).optional(),
  }),
  async ({ title, authorIds, tags }, { payload, user }) => {
    const book = await payload.create({
      collection: "books",
      data: {
        title,
        slug: slugify(title),
        status: "draft",
        submitter: user.id,
        authors: authorIds, // Relationship IDs
        tags: tags, // Relationship IDs
        source: "submitted",
      },
      depth: FULL_BOOK_DEPTH,
    });

    return new FullBook(book);
  },
);
```

### Patterns for Complex Operations

**Upsert pattern:**

```typescript
const existing = await payload.find({
  collection: "locations",
  where: { placeId: { equals: placeId } },
  limit: 1,
});

if (existing.docs[0]) {
  return existing.docs[0];
}

return await payload.create({
  collection: "locations",
  data: { placeId, displayText, slug },
});
```

**Nested relationship updates:**

```typescript
await payload.update({
  collection: "books",
  id: bookId,
  data: {
    authors: authorIds, // Replace relationships
    contributions: contributionIds, // Replace relationships
  },
});
```

---

## Phase 6: Raw SQL Services ✅ COMPLETE

**Goal:** Migrate services using raw SQL to Payload's Drizzle integration

### Migrated Services (2 total) ✅

- ✅ `web/src/core/services/books/fetch-books.ts` - **COMPLETE** - Complex color matching, search optimization
- ✅ `web/src/core/services/books/fetch-similar-books.ts` - **COMPLETE** - Tag-based similarity with Drizzle joins

### Completed: fetch-books.ts ✅

**Full migration from Prisma raw SQL to Drizzle ORM:**

1. ✅ **Type-safe query structure** - Proper Drizzle types with `Awaited<ReturnType<>>` pattern
2. ✅ **Subquery-based filtering** - Eliminated cartesian explosion by using `inArray(books.id, subquery)` instead of joins
3. ✅ **Bulk fetching pattern** - Separate queries for authors/contributions/palette (4 queries total: 1 books + 3 related)
4. ✅ **All filters implemented:**
   - Status, submitter, tags, profiles (authors/contributors), publisher
   - Page count range, release year range
   - Color matching with HSL distance calculations
   - Search using computed `searchText` field
5. ✅ **Color matching system:**
   - HSL distance calculation with hue wraparound handling
   - Correlated subquery for scoring (best match from palette)
   - Supports both named colors and exact HSL arrays
   - Works with and without color filter (sorting by first palette hue as fallback)
6. ✅ **Search optimization:**
   - Added computed `searchText` field to books collection
   - Created `updateSearchText` hook to auto-populate on changes
   - Single indexed column lookup vs 4 separate table scans (3-10x faster)
   - Uses ' | ' separator to prevent false matches across field boundaries
7. ✅ **Pagination and sorting** - Release date, created date, title, color match score
8. ✅ **Schema references** - All SQL uses Drizzle table references (e.g., `${books_palette.color}`) instead of aliases
9. ✅ **Migration support** - Added Phase 8 to migration SQL to populate `searchText` for existing books

**Key patterns established:**

- Subqueries for filtering (avoids joins in main query)
- Bulk fetching for related data (prevents N+1)
- Correlated subqueries for computed columns
- Type-safe SQL with Drizzle schema references

### Completed: fetch-similar-books.ts ✅

**Tag-based similarity matching using Drizzle joins:**

1. ✅ **Drizzle query structure** - Uses `innerJoin` to traverse relationships
2. ✅ **Tag extraction** - Queries tags for input book via books_rels polymorphic table
3. ✅ **Reuses fetch-books** - Calls fetchBooks service with tag filter
4. ✅ **Proper filtering** - Excludes the input book from results

**Implementation pattern:**

```typescript
// Get tags for the input book
const inputBookTags = await db
  .select({ tagSlug: tags.slug })
  .from(tags)
  .innerJoin(
    books_rels,
    and(eq(books_rels.tagsID, tags.id), eq(books_rels.path, "tags")),
  )
  .innerJoin(books, eq(books_rels.parent, books.id))
  .where(eq(books.slug, slug));

// Use existing fetchBooks service for similarity
const res = await fetchBooks.call({ tags: tagSlugs, perPage: 10 }, { payload });

// Filter out the input book
return res.data.books.filter((book) => book.slug !== slug);
```

**Key benefits:**

- Leverages polymorphic books_rels table correctly
- Reuses complex fetchBooks logic (no duplication)
- Type-safe with Drizzle operators

### Implementation Notes

**Dynamic Query Building Pattern:**

```typescript
// Create reusable function that receives PgSelect and applies joins/where
function withFiltersAndJoins<T extends PgSelect>(
  qb: T,
  filters: Filters
) {
  let query = qb
    .leftJoin(images, eq(books.coverImage, images.id))
    .leftJoin(publishers, eq(books.publisher, publishers.id))
    .$dynamic()

  // Conditional joins based on filters
  if (filters.tags?.length) {
    query = query.leftJoin(books_rels, ...)
  }

  // Apply where conditions
  if (where.length > 0) {
    query = query.where(and(...where))
  }

  return query
}

// Use it for both count and select
const countQuery = withFiltersAndJoins(
  db.select({ count: countDistinct(books.id) }).from(books).$dynamic(),
  filters
)

const selectQuery = withFiltersAndJoins(
  db.select({ ...fields }).from(books).$dynamic(),
  filters
)
```

**Key Drizzle Patterns:**

- Use `PgSelect` type for reusable query functions
- Use `.$dynamic()` to enable further chaining after joins
- Use `countDistinct(books.id)` instead of `sql<number>\`count(distinct ...)\``
- Prefer native Drizzle operators (`eq`, `inArray`, `gte`, `lte`) over raw SQL
- Use `sql` template only for complex expressions (window functions, JSONB operations, EXTRACT)

### Requirements and Guidelines

- Leverage Drizzle's type-safe SQL capabilities
- Prefer native drizzle features (e.g. `eq`, `inArray`) over raw SQL where possible
- When using raw SQL, ensure type safety with `sql` template tags and keep it minimal
- Read [conditional filtering docs](https://orm.drizzle.team/docs/guides/conditional-filters-in-query)
- Read [raw SQL snippets docs](https://orm.drizzle.team/docs/sql)

### Schema Structure

**Key tables:**

- `books` - Main book data
- `books_palette` - Array field, separate table with `_parentID` FK to books
- `books_contributions` - Array field, separate table with `_parentID` FK to books
- `books_rels` - Polymorphic relationship table for authors/tags (uses `path` to distinguish)
  - `path = 'authors'` → `profilesID` set
  - `path = 'tags'` → `tagsID` set

---

## Phase 7: Move Jobs & Email into Web, Remove Prisma ✅ COMPLETE

**Goal:** Move Inngest jobs and email into the web app, convert all Prisma usage to Payload, delete orphaned packages.

### What Changed

Rather than migrating from Inngest to Payload Jobs, we kept Inngest as the job orchestration layer and moved everything into `web/`. The old `packages/jobs`, `packages/email`, and `packages/database` directories were deleted.

### Completed Changes

#### Jobs (`packages/jobs/` → `web/src/jobs/`)

- Moved Inngest client from `web/src/core/jobs/` to `web/src/jobs/index.ts`
- Added Payload middleware (`web/src/jobs/middleware.ts`) that injects a `payload` instance into all function handlers via `transformInput`
- Moved all 6 job functions, converting Prisma queries to Payload API
- Added Inngest API route at `web/src/app/api/inngest/route.ts`
- Updated all `src/core/jobs` imports across web to `src/jobs`

| Job                  | Prisma → Payload Changes                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `generate-palette`   | `prisma.book`, `prisma.image` → `payload.findByID`, `payload.update`                                                             |
| `convert-webp`       | `prisma.book`, `prisma.image`, `prisma.$transaction` → Payload equivalents                                                       |
| `clean-images`       | Rewrote: single SQL query with LEFT JOINs to find orphaned images, `payload.delete()` for cleanup (S3 handled by storage plugin) |
| `send-email`         | Uses `payload` from middleware context, passes to `sendEmail()`                                                                  |
| `send-verification`  | No database usage, import paths only                                                                                             |
| `send-vote-reminder` | `prisma.bookVote.count` → `payload.count({ collection: 'book-votes' })`                                                          |

#### Email (`packages/email/` → `web/src/email/`)

- Moved all email source files (templates, components, utils) into `web/src/email/`
- Updated `sendEmail` to accept a `BasePayload` instance as first parameter
- Added `TransformContext` with `payload` to template transform signatures
- Replaced Prisma query in `verify-email.tsx` transform with `payload.find({ collection: 'users' })`
- Kept React Email + Postmark for rendering and sending

#### Event Dispatch Consolidation

- Converted `triggerPaletteGeneration` from a field hook on `coverImage` to a collection-level `afterChange` hook renamed `onCoverImageChange`
- Uses `extractId()` to compare previous/new cover image IDs (avoids false positives from populated vs ID-only values)
- Removed manual `inngest.send('book.updated')` from `update-book.ts` and `process-book-import.ts` — the collection hook is now the single source of truth
- Removed duplicate event re-emit from `convert-webp` job — the webp check (`filename.endsWith('.webp')`) naturally terminates the chain

#### Package Cleanup

- Deleted `packages/jobs/`, `packages/email/`, `packages/database/`
- Removed `packages/email` from npm workspaces
- Moved vibrant dependencies (`@vibrant/*`) to web/package.json

### Key Files

| File                                                               | Purpose                                         |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| `web/src/jobs/index.ts`                                            | Inngest client with Payload + Sentry middleware |
| `web/src/jobs/middleware.ts`                                       | Injects `payload` into all job handlers         |
| `web/src/jobs/functions/*.ts`                                      | All job functions (6 total)                     |
| `web/src/jobs/lib/generate-palette/`                               | Palette extraction using Vibrant                |
| `web/src/app/api/inngest/route.ts`                                 | Next.js API route serving Inngest               |
| `web/src/email/`                                                   | All email templates, components, utils          |
| `web/src/payload/collections/books/hooks/on-cover-image-change.ts` | Single event dispatch for cover image changes   |

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
- ✅ Phase 4: Auth adapter migrated
- ✅ Phase 5: Complex CRUD services migrated (14 services)
- ✅ Phase 6: Raw SQL services migrated (2 services)
- ✅ Phase 7: Jobs & email moved into web, Prisma removed, event dispatch consolidated
- ✅ Phase 8: Web services fully migrated
- 📋 No TypeScript errors
- 📋 Dev server runs successfully
- 📋 All features working in preview deployment
- ✅ Prisma dependencies removed

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

- ✅ **Phase 5 Complete:** Complex CRUD services migration (14 services)
  - Upsert patterns: `findOrCreateLocation`, `findOrCreateProfile`
  - Book management: `updateBook`, `createBook`, `updateContributors`
  - Memberships: `createInvite`, `acceptInvite`, `destroyMembership`, `deleteInvite`, `resendInvite`, `updateMembership`
  - Profile/Publisher: `updateProfile`, `updatePublisher`
  - Other: `fetchContributions`
  - **Fixed:** `updateContributors` now correctly updates `books.contributions` array field instead of separate collection

### 2026-01-05

- 🔄 **Phase 6 In Progress:** Raw SQL Services migration
  - ✅ **fetch-books.ts COMPLETE:** Full Drizzle migration with search optimization
    - Migrated from Prisma raw SQL to Drizzle ORM
    - Implemented subquery-based filtering (eliminated cartesian explosion)
    - Added all filters: status, submitter, tags, profiles, publisher, page count, release year, color, search
    - Implemented HSL color matching with distance calculations and hue wraparound
    - Added computed `searchText` field with auto-population hook (3-10x faster searches)
    - Used ' | ' separator in searchText to prevent false matches
    - Converted all SQL to use Drizzle schema references
    - Added Phase 8 to migration SQL for searchText population
    - Fixed color sorting to work with and without color filter
  - ✅ **fetch-similar-books.ts COMPLETE:** Tag-based similarity using Drizzle joins
    - Queries tags via books_rels polymorphic table
    - Reuses fetchBooks service for tag-based filtering
    - Properly excludes input book from results

### 2026-01-06

- ✅ **Phase 4 Complete:** NextAuth Adapter Migration
  - Migrated to payload-authjs package using `getAuthjsInstance(payload)`
  - Updated users and accounts collections for auth compatibility
  - Removed Prisma adapter dependencies
  - Simplified auth configuration with native Payload integration

- ✅ **Phase 6 Complete:** Raw SQL Services migration (all services migrated)

### 2026-02-02

- ✅ **SearchResults Collection:** Replaced PostgreSQL `search_results` view with Payload collection
  - Created `search-results` collection with polymorphic `source` relationship
  - Added sync hooks on books, profiles, publishers, tags, and collections
  - Implemented relevance-based sorting (name matches before description matches)
  - Used single `profile` type instead of `author`/`contributor` distinction
  - Added `syncRelatedSearchResultsOnDelete` to clean up stale entries

- ✅ **Location Filter Options:** Replaced PostgreSQL `location_filter_options` view
  - Generates country/region/location options dynamically from locations collection
  - Uses Map for deduplication, preferring looser matches (country > region > location)
  - Removed unused `profileCount` field (only used for sorting, but client filters locally)
  - Deleted orphaned `fetch-location-filter-option.ts` service

- ✅ **All PostgreSQL views now replaced with Payload-native solutions**

### 2026-02-07

- ✅ **Phase 7 Complete:** Jobs & email moved into web, all Prisma usage removed
  - Moved Inngest jobs from `packages/jobs/` to `web/src/jobs/`, kept Inngest as orchestration layer
  - Added Payload middleware to inject `payload` into all job handlers via `transformInput`
  - Added Inngest API route at `web/src/app/api/inngest/route.ts`
  - Moved email from `packages/email/` to `web/src/email/`, updated `sendEmail` to accept Payload instance
  - Replaced Prisma in `verify-email.tsx` transform with Payload query
  - Rewrote `clean-images` job: uses single SQL query with LEFT JOINs instead of Payload API (efficient for ~10k images)
  - Consolidated event dispatch: `onCoverImageChange` collection hook is the single source of `book.updated` events
  - Removed manual `inngest.send()` from `update-book.ts` and `process-book-import.ts`
  - Removed duplicate event re-emit from `convert-webp` — webp check naturally terminates the chain
  - Deleted `packages/jobs/`, `packages/email/`, `packages/database/`

**Last Updated:** 2026-02-07
