import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Payload } from 'payload'
import { Book } from 'src/core/models/book'
import { SearchResult } from 'src/core/models/search-result'
import type { ServiceResult } from 'src/core/services/base'
import { NamedColor } from 'src/core/services/books/colors'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { fetchBooks } from 'src/core/services/books/fetch-books'
import { fetchFrequentCollaborators } from 'src/core/services/books/fetch-frequent-collaborators'
import { fetchCollection } from 'src/core/services/collections/fetch-collection'
import { fetchCollections } from 'src/core/services/collections/fetch-collections'
import { fetchFeatures } from 'src/core/services/features/fetch-features'
import { fetchFeaturedProfiles } from 'src/core/services/home/fetch'
import { fetchJobs } from 'src/core/services/jobs/fetch-jobs'
import { fetchProfile } from 'src/core/services/profiles/fetch-profile'
import { fetchProfiles } from 'src/core/services/profiles/fetch-profiles'
import { fetchPublisher } from 'src/core/services/publishers/fetch-publisher'
import { quickSearch } from 'src/core/services/search/quick-search'
import { fetchTagGroups } from 'src/core/services/tags/fetch-groups'
import { BOOK_DEPTH } from 'src/core/services/utils/payload-depth'
import { appUrl } from 'src/utils/app-url'
import { z } from 'zod'
import {
  bookDetail,
  bookSummary,
  collectionSummary,
  profileDetail,
  profileSummary,
  publisherDetail
} from './format'

/**
 * A read-only MCP server exposing the site's published content. Every tool
 * goes through the same services as the website and only returns public data.
 */

const DAY = 24 * 60 * 60 * 1000

const limit = z
  .number()
  .int()
  .min(1)
  .max(50)
  .optional()
  .describe('Maximum number of results (default 20, max 50)')

const page = z
  .number()
  .int()
  .min(1)
  .optional()
  .describe('Page of results, starting at 1')

const readOnly = { readOnlyHint: true, openWorldHint: false }

function unwrap<T>(result: ServiceResult<T>): T {
  if (result.success) return result.data
  throw new Error(result.errors.map((error) => error.message).join(', '))
}

function json(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }]
  }
}

async function publicTagSlugs(payload: Payload) {
  const groups = unwrap(await fetchTagGroups.call(undefined, { payload }))
  return new Set(groups.flatMap((group) => group.tags.map((tag) => tag.slug)))
}

export function createMcpServer(payload: Payload) {
  const ctx = { payload }
  const server = new McpServer({ name: 'books-about-food', version: '1.0.0' })

  server.registerTool(
    'search_books',
    {
      title: 'Search books',
      description:
        'Find published cookbooks using the same filters as the website. Filter by text, tags, publisher, a person (as author or contributor), release year or cover colour.',
      inputSchema: {
        query: z.string().optional().describe('Text to search for'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Tag slugs, as returned by list_tags'),
        publisher: z.string().optional().describe('Publisher slug'),
        person: z
          .string()
          .optional()
          .describe('Profile slug of an author or contributor'),
        colour: z
          .enum(NamedColor)
          .optional()
          .describe('A colour that appears on the cover'),
        releaseYear: z.number().int().optional(),
        sort: z
          .enum(['releaseDate', 'createdAt', 'title', 'color', 'random'])
          .optional()
          .describe('Defaults to release date, newest first'),
        limit,
        page
      },
      annotations: readOnly
    },
    async function (input) {
      const result = unwrap(
        await fetchBooks.call(
          {
            search: input.query,
            tags: input.tags,
            publisherSlug: input.publisher,
            profile: input.person,
            color: input.colour,
            releaseYear: input.releaseYear,
            sort: input.sort,
            status: 'published',
            perPage: input.limit ?? 20,
            page: (input.page ?? 1) - 1
          },
          ctx
        )
      )
      return json({
        total: result.total,
        books: result.books.map(bookSummary)
      })
    }
  )

  server.registerTool(
    'get_book',
    {
      title: 'Get book',
      description:
        'Everything about one published cookbook: description, design commentary, publisher, authors, contributors and their roles, tags, cover and preview images, background colour and palette, and buying links.',
      inputSchema: { slug: z.string().describe('Book slug') },
      annotations: readOnly
    },
    async function ({ slug }) {
      const book = unwrap(
        await fetchBook.call({ slug, onlyPublished: true }, ctx)
      )
      return json(bookDetail(book))
    }
  )

  server.registerTool(
    'new_releases',
    {
      title: 'New releases',
      description:
        'Published cookbooks with a release date in a date range, newest first. Defaults to the last 30 days. Use a future end date to include upcoming releases.',
      inputSchema: {
        from: z.iso
          .date()
          .optional()
          .describe('Start date, YYYY-MM-DD (default 30 days ago)'),
        to: z.iso
          .date()
          .optional()
          .describe('End date, YYYY-MM-DD (default today)'),
        limit
      },
      annotations: readOnly
    },
    async function (input) {
      const to = input.to ? new Date(input.to) : new Date()
      const from = input.from
        ? new Date(input.from)
        : new Date(to.getTime() - 30 * DAY)
      const { docs } = await payload.find({
        collection: 'books',
        where: {
          and: [
            { status: { equals: 'published' } },
            { releaseDate: { greater_than_equal: from.toISOString() } },
            {
              releaseDate: {
                less_than: new Date(to.getTime() + DAY).toISOString()
              }
            }
          ]
        },
        sort: '-releaseDate',
        limit: input.limit ?? 20,
        depth: BOOK_DEPTH
      })
      return json(docs.map((doc) => bookSummary(new Book(doc))))
    }
  )

  server.registerTool(
    'search_profiles',
    {
      title: 'Search people',
      description:
        'Find people who have worked on published cookbooks, by name, job or location.',
      inputSchema: {
        query: z.string().optional().describe('Name to search for'),
        jobs: z
          .array(z.string())
          .optional()
          .describe('Job names, as returned by list_jobs, or "Author"'),
        locations: z
          .array(z.string())
          .optional()
          .describe(
            'Location slugs, or "country:<name>" / "region:<name>", e.g. "country:France"'
          ),
        sort: z.enum(['name', 'trending']).optional(),
        limit,
        page
      },
      annotations: readOnly
    },
    async function (input) {
      let jobIds: string[] | undefined
      if (input.jobs?.length) {
        const wanted = input.jobs.map((job) => job.toLowerCase())
        const jobs = unwrap(await fetchJobs.call({}, ctx))
        jobIds = jobs
          .filter((job) => wanted.includes(job.name.toLowerCase()))
          .map((job) => job.id)
        if (wanted.includes('author')) jobIds.push('author')
      }

      const result = unwrap(
        await fetchProfiles.call(
          {
            search: input.query,
            jobs: jobIds,
            locations: input.locations,
            sort: input.sort,
            onlyPublished: true,
            perPage: input.limit ?? 20,
            page: (input.page ?? 1) - 1
          },
          ctx
        )
      )
      return json({
        total: result.total,
        profiles: result.profiles.map(profileSummary)
      })
    }
  )

  server.registerTool(
    'get_profile',
    {
      title: 'Get person',
      description:
        "A person's profile: bio, job title, location, links, and the published cookbooks they wrote or worked on, with their role on each.",
      inputSchema: { slug: z.string().describe('Profile slug') },
      annotations: readOnly
    },
    async function ({ slug }) {
      const profile = unwrap(
        await fetchProfile.call({ slug, onlyPublished: true }, ctx)
      )
      if (!profile) throw new Error('Profile not found')

      const { books } = unwrap(
        await fetchBooks.call(
          { profile: slug, status: 'published', perPage: 100 },
          ctx
        )
      )
      const work = books.flatMap(function (book) {
        const roles = [
          ...(book.authors.some((author) => author.slug === slug)
            ? ['Author']
            : []),
          ...book.contributions
            .filter((c) => c.profile.slug === slug && !c.hidden)
            .map((c) => c.jobName)
        ]
        if (!roles.length) return []
        return [{ ...bookSummary(book), roles }]
      })

      return json({ ...profileDetail(profile), books: work })
    }
  )

  server.registerTool(
    'get_frequent_collaborators',
    {
      title: 'Get frequent collaborators',
      description:
        'The people someone has worked with on more than one cookbook, most frequent first. The same as the "Frequent Collaborators" section on their profile page.',
      inputSchema: { slug: z.string().describe('Profile slug') },
      annotations: readOnly
    },
    async function ({ slug }) {
      const collaborators = unwrap(
        await fetchFrequentCollaborators.call({ slug }, ctx)
      )
      return json(collaborators.map(profileSummary))
    }
  )

  server.registerTool(
    'get_publisher',
    {
      title: 'Get publisher',
      description:
        'A publisher: description, links, logo, parent house and imprints, plus their published cookbooks.',
      inputSchema: {
        slug: z.string().describe('Publisher slug'),
        limit
      },
      annotations: readOnly
    },
    async function ({ slug, limit: bookLimit }) {
      const publisher = unwrap(await fetchPublisher.call({ slug }, ctx))
      if (!publisher) throw new Error('Publisher not found')

      const { books, total } = unwrap(
        await fetchBooks.call(
          {
            publisherSlug: slug,
            status: 'published',
            perPage: bookLimit ?? 20
          },
          ctx
        )
      )
      return json({
        ...publisherDetail(publisher),
        bookCount: total,
        books: books.map(bookSummary)
      })
    }
  )

  server.registerTool(
    'list_collections',
    {
      title: 'List collections',
      description: 'Curated collections of cookbooks.',
      inputSchema: {
        publisher: z
          .string()
          .optional()
          .describe('Only collections from this publisher (slug)'),
        limit,
        page
      },
      annotations: readOnly
    },
    async function (input) {
      const result = unwrap(
        await fetchCollections.call(
          {
            publisherSlug: input.publisher,
            perPage: input.limit ?? 20,
            page: (input.page ?? 1) - 1
          },
          ctx
        )
      )
      return json({
        total: result.total,
        collections: result.collections.map(collectionSummary)
      })
    }
  )

  server.registerTool(
    'get_collection',
    {
      title: 'Get collection',
      description: 'A curated collection and the cookbooks in it.',
      inputSchema: { slug: z.string().describe('Collection slug') },
      annotations: readOnly
    },
    async function ({ slug }) {
      const collection = unwrap(await fetchCollection.call({ slug }, ctx))
      if (!collection) throw new Error('Collection not found')
      return json({
        ...collectionSummary(collection),
        books: collection.books.map(bookSummary)
      })
    }
  )

  server.registerTool(
    'get_featured',
    {
      title: 'Get featured',
      description:
        'The cookbooks and people currently featured on the homepage, with their tag lines.',
      annotations: readOnly
    },
    async function () {
      const [features, people] = await Promise.all([
        fetchFeatures.call(undefined, ctx),
        fetchFeaturedProfiles(payload)
      ])
      return json({
        books: unwrap(features).map((feature) => ({
          tagLine: feature.tagLine,
          ...bookSummary(feature.book)
        })),
        people: people.map(profileSummary)
      })
    }
  )

  server.registerTool(
    'search_all',
    {
      title: 'Search everything',
      description:
        'One search across cookbooks, people, publishers, tags and collections, like the search bar on the website.',
      inputSchema: {
        query: z.string().min(3).describe('At least 3 characters')
      },
      annotations: readOnly
    },
    async function ({ query }) {
      const docs = unwrap(await quickSearch.call({ query }, ctx))
      const results = docs.map((doc) => new SearchResult(doc))

      // Search results include draft collections and admin-only tags, so drop
      // anything that isn't public.
      const collectionSlugs = results
        .filter((result) => result.type === 'collection')
        .map((result) => result.slug)
      const [publishedCollections, tagSlugs] = await Promise.all([
        collectionSlugs.length
          ? payload.find({
              collection: 'collections',
              where: {
                slug: { in: collectionSlugs },
                status: { equals: 'published' }
              },
              pagination: false,
              depth: 0
            })
          : { docs: [] },
        publicTagSlugs(payload)
      ])
      const publishedSlugs = new Set(
        publishedCollections.docs.map((collection) => collection.slug)
      )

      return json(
        results
          .filter(function (result) {
            if (result.type === 'collection') {
              return publishedSlugs.has(result.slug)
            }
            if (result.type === 'bookTag') return tagSlugs.has(result.slug)
            return true
          })
          .map((result) => ({
            type: result.type,
            name: result.name,
            slug: result.slug,
            description: result.description,
            url: appUrl(result.href)
          }))
      )
    }
  )

  server.registerTool(
    'list_tags',
    {
      title: 'List tags',
      description:
        'Public tag groups and their tags. Use the tag slugs to filter search_books.',
      annotations: readOnly
    },
    async function () {
      const groups = unwrap(await fetchTagGroups.call(undefined, ctx))
      return json(
        groups.map((group) => ({
          name: group.name,
          slug: group.slug,
          tags: group.tags.map((tag) => ({ name: tag.name, slug: tag.slug }))
        }))
      )
    }
  )

  server.registerTool(
    'list_jobs',
    {
      title: 'List jobs',
      description:
        'Contributor roles, such as Photographer or Food Stylist. Use these names to filter search_profiles.',
      annotations: readOnly
    },
    async function () {
      const jobs = unwrap(await fetchJobs.call({}, ctx))
      return json(jobs.map((job) => job.name))
    }
  )

  return server
}
