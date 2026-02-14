import { FullBook } from 'src/core/models/full-book'
import { Profile } from 'src/core/models/profile'
import { updateBook } from 'src/core/services/books/update-book'
import { User } from 'src/core/types'
import { call } from 'src/utils/service'

export type StepCompletionMeta =
  | undefined
  | {
      text?: string
      profiles?: Profile[]
    }

export class BookEditState {
  constructor(
    private book: FullBook,
    private user?: User
  ) {}

  get complete() {
    return this.book.status !== 'draft'
  }

  get disabled() {
    return this.complete && this.user?.role !== 'admin'
  }

  link(path: string) {
    return `/edit/${this.book.slug}/${path}`
  }

  async submitForReview() {
    if (!this.valid) return
    await call(updateBook, { slug: this.book.slug, status: 'inReview' })
  }

  get valid() {
    return (
      this.titleComplete &&
      this.imagesComplete &&
      this.publisherComplete &&
      this.teamComplete
    )
  }

  get titleComplete(): StepCompletionMeta {
    const complete = !!this.book.title && !!this.book.authors.length
    if (complete) return { profiles: this.book.authors }
  }

  get imagesComplete(): StepCompletionMeta {
    const complete = !!this.book.cover
    if (complete) return { text: `${this.book.previewImages.length + 1}` }
  }

  get publisherComplete(): StepCompletionMeta {
    const complete = !!this.book.publisher
    let count = complete ? 1 : 0
    if (this.book.releaseDate) count++
    if (this.book.pages) count++

    if (complete) return { text: `${count} / 3` }
  }

  get teamComplete(): StepCompletionMeta {
    const complete = !!this.book.team.length
    if (complete) return { profiles: this.book.team }
  }

  get linksComplete(): StepCompletionMeta {
    const complete = !!this.book.links.length
    if (complete) return { text: `${this.book.links.length}` }
  }
}
