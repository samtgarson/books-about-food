import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import { BookPreview } from '../components/book-preview'
import { Section } from '../components/section'
import Text from '../components/text'

export type SubmissionPublishedProps = {
  recipientName?: string
  title: string
  author: string
  slug: string
  coverUrl?: string | null
}

export const SubmissionPublished: Template<SubmissionPublishedProps> = ({
  recipientName,
  title,
  author,
  slug,
  coverUrl
}) => {
  return (
    <BaseLayout preview="You're in!" recipientName={recipientName}>
      <Section>
        <Text>
          The book you submitted for review has now been published on the
          website.
        </Text>
        <Text>Click the preview below to view it on the website.</Text>
        <BookPreview
          href={`https://booksaboutfood.info/cookbooks/${slug}`}
          title={title}
          author={author}
          cover={coverUrl ?? null}
        />
        <Text>Thanks for submitting!</Text>
      </Section>
    </BaseLayout>
  )
}
SubmissionPublished.subject = 'We’ve published your submission'
