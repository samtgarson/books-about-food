import prisma from 'database'
import { FullBook } from 'src/models/full-book'
import { Profile } from 'src/models/profile'

export type StepCompletionMeta =
  | undefined
  | {
    text?: string
    profiles?: Profile[]
  }

export class BookEditState {
  constructor(private book: FullBook) { }

  get inReview() {
    return this.book.status === 'inReview'
  }

  link(path: string) {
    return `/edit/${this.book.slug}/${path}`
  }

  async submitForReview() {
    if (!this.valid) return
    await prisma.book.update({
      where: { id: this.book.id },
      data: { status: 'inReview' }
    })
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
    if (complete) return { text: this.book.publisher?.name }
  }

  get teamComplete(): StepCompletionMeta {
    const complete = !!this.book.team.length
    if (complete) return { profiles: this.book.team }
  }

  get linksComplete(): StepCompletionMeta {
    const complete = !!this.book.links.length
    if (complete) return { text: `${this.book.links.length}` }
  }

  get furtherInformationComplete(): StepCompletionMeta {
    const complete =
      !!this.book.releaseDate &&
      typeof this.book.pages === 'number' &&
      !!this.book.tags.length
    if (complete) return {}
  }
}
