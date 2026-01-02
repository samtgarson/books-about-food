export type ResultAuthor = {
  name: string
  id?: string
  error?: MatchError
}

export type ResultContribution = {
  job: string
  name: string
  id?: string
  error?: MatchError
}

export type MatchError = 'MultipleMatches'
export type ImportRowError = 'Duplicate' | 'Existing'

export type ResultRow = {
  id: string
  bookAttrs: {
    title: string
    slug: string
    subtitle?: string
    releaseDate?: string
    pages?: number
    tags: string[]
    publisher?: string
  }
  authors: ResultAuthor[]
  contributors: ResultContribution[]
  errors: ImportRowError[]
}
