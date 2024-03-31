import { appUrl } from '@books-about-food/shared/utils/app-url'
import { BookPreview } from '../components/book-preview'
import { Section } from '../components/section'
import Text from '../components/text'
import { createTemplate } from '../utils/create-template'

export type SubmissionPublishedProps = {
  title: string
  author: string
  slug: string
  coverUrl?: string | null
}

export const SubmissionPublished = createTemplate<SubmissionPublishedProps>({
  subject: 'We’ve published your submission',
  preview: 'Thanks for submitting, check out your book on Books About Food',
  content({ title, author, slug, coverUrl }) {
    return (
      <Section>
        <Text>
          The book you submitted for review has now been published on the
          website.
        </Text>
        <Text>Click the preview below to view it on the website.</Text>
        <BookPreview
          href={appUrl(`/cookbooks/${slug}`)}
          title={title}
          author={author}
          cover={coverUrl ?? null}
        />
        <Text>Thanks for submitting!</Text>
      </Section>
    )
  }
})
