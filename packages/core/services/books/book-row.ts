import { BookAttrs } from '@books-about-food/core/models/types'
import { CamelCaseKeys } from '@books-about-food/core/utils/types'
import { BookSource, BookStatus } from '@books-about-food/database'
import { transformKeys } from '@books-about-food/shared/utils/object'
import { camelize } from 'inflection'

const camelizeKeys = <T extends Record<string, unknown>>(obj: T) =>
  transformKeys<CamelCaseKeys<T>>(obj, (str) => camelize(str, true))

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
  cover_image: CoverImage
  authors: Array<Profile | null>
  contributions: Array<ContributionsEntity | null>
}
export interface CoverImage extends Record<string, unknown> {
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
}
export interface Avatar extends Record<string, unknown> {
  id: string
  path: string
  width: number
  height: number
  caption: null
  created_at: Date
  profile_id: string
  updated_at: Date
  cover_for_id: null
  publisher_id: null
  preview_for_id: null
  placeholder_url: string
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
  avatar: Avatar | null
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
