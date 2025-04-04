import { Book } from '@books-about-food/core/models/book'
import { BookAttrs } from '@books-about-food/core/models/types'
import { CamelCaseKeys } from '@books-about-food/core/utils/types'
import prisma, {
  BookSource,
  BookStatus,
  Prisma
} from '@books-about-food/database'
import { transformKeys } from '@books-about-food/shared/utils/object'
import { camelize } from 'inflection'
const { raw } = Prisma

export async function queryBooks(
  template: TemplateStringsArray,
  ...params: unknown[]
) {
  const raw = await prisma.$queryRaw<BookRow[]>(template, ...params)
  return raw.map((book) => new Book(rowToBookAttrs(book)))
}

const camelizeKeys = <T extends Record<string, unknown>>(obj: T) =>
  transformKeys<CamelCaseKeys<T>>(obj, (str) => camelize(str, true))

export const bookSelect = raw(`
  books.*,
  row_to_json(cover_image.*)::jsonb cover_image,
  json_agg(distinct authors.*)::jsonb authors,
  json_agg(distinct contributions.*)::jsonb contributions
`)

export const bookJoin = raw(`
  left outer join lateral (
      select contributions.*, row_to_json(jobs.*)::jsonb job, row_to_json(profiles.*)::jsonb profile from contributions
    inner join jobs on jobs.id = contributions.job_id
    left outer join lateral (
      select
        profiles.*,
        count(authored_books.*) as authored_book_count,
        row_to_json(images.*)::jsonb avatar
      from profiles
      left outer join images on images.profile_id = profiles.id
      left outer join _authored_books authored_books on authored_books."B" = profiles.id
      where contributions.profile_id = profiles.id
      group by profiles.id, images.id
    ) profiles on true
    where contributions.book_id = books.id
  ) contributions on true
  left outer join lateral (
    select
      profiles.*,
      count(authored_books.*) as authored_book_count,
      row_to_json(images.*)::jsonb as avatar
    from profiles
    left outer join images on images.profile_id = profiles.id
    left outer join _authored_books on _authored_books."A" = books.id
    left outer join _authored_books authored_books on authored_books."B" = profiles.id
    where _authored_books."B" = profiles.id
    group by profiles.id, images.id
  ) authors on true
  left outer join publishers on publishers.id = books.publisher_id
  left outer join images cover_image on cover_image.cover_for_id = books.id
`)

export function rowToBookAttrs({
  cover_image,
  contributions,
  authors,
  ...row
}: BookRow): BookAttrs {
  const attrs = {
    ...camelizeKeys(row),
    coverImage: camelizeKeys(cover_image),
    contributions: contributions
      .filter((c): c is ContributionsEntity => c !== null)
      .map(mapContribution),
    authors: authors.filter((c): c is Profile => c !== null).map(mapProfile)
  }
  return attrs
}

function mapContribution(
  contribution: ContributionsEntity
): BookAttrs['contributions'][0] {
  return {
    ...camelizeKeys(contribution),
    job: camelizeKeys(contribution.job),
    profile: mapProfile(contribution.profile)
  }
}

function mapProfile(profile: Profile): BookAttrs['authors'][0] {
  return {
    ...camelizeKeys(profile),
    avatar: profile.avatar ? camelizeKeys(profile.avatar) : null,
    _count: { authoredBooks: profile.authored_book_count }
  }
}

export interface BookRow extends Record<string, unknown> {
  id: string
  created_at: Date
  updated_at: Date
  title: string
  subtitle: string
  release_date: Date
  pages: number
  publisher_id: string
  slug: string
  status: BookStatus
  submitter_id: null
  google_books_id: null
  source: BookSource
  palette: number[]
  background_color: number[]
  primary_color: number[]
  cover_image: Image
  authors: Array<Profile | null>
  contributions: Array<ContributionsEntity | null>
  design_commentary: string | null
  blurb: string | null
}
export interface Image extends Record<string, unknown> {
  id: string
  path: string
  width: number
  height: number
  caption: null
  created_at: Date
  profile_id: null
  updated_at: Date
  cover_for_id: string
  publisher_id: null
  preview_for_id: null
  placeholder_url: string
  order: number
  post_id: null
}
export interface ContributionsEntity extends Record<string, unknown> {
  id: string
  job: Job
  tag: null
  hidden: boolean
  job_id: string
  book_id: string
  profile: Profile
  created_at: Date
  profile_id: string
  updated_at: Date
}
export interface Job extends Record<string, unknown> {
  id: string
  name: string
  featured: boolean
  created_at: Date
  updated_at: Date
}
export interface Profile extends Record<string, unknown> {
  id: string
  name: string
  slug: string
  avatar: Image | null
  user_id: null
  website: string
  location: null
  instagram: string
  job_title: string
  created_at: Date
  updated_at: Date
  description: null
  hidden_collaborators: string[]
  most_recently_published_on: Date | null
  authored_book_count: number
}
