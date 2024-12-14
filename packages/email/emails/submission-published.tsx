import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Text } from '@react-email/components'
import { BookPreview } from '../components/book-preview'
import { WhiteSection } from '../components/white-section'
import { emailTemplate } from '../utils/create-template'

export type SubmissionPublishedProps = {
  title: string
  author: string
  slug: string
  coverUrl?: string | null
}

export default emailTemplate({
  component({ title, author, slug, coverUrl }: SubmissionPublishedProps) {
    return (
      <>
        <Text>
          The book you submitted for review has now been published on the
          website.
        </Text>
        <WhiteSection>
          <Text>Click the preview below to view it on the website.</Text>
          <BookPreview
            href={appUrl(`/cookbooks/${slug}`)}
            title={title}
            author={author}
            cover={coverUrl ?? null}
          />
        </WhiteSection>
        <Text>Thanks for submitting!</Text>
      </>
    )
  },
  previewProps: {
    title: 'Make More With Less',
    slug: 'slug',
    author: 'Kitty Coles',
    coverUrl:
      'https://assets.booksaboutfood.info/books/fec8411a-e587-46ac-a098-fee23751d315/cover/8cfccc54-0769-4abd-bd6a-5944e52a3f0a.jpeg'
  },
  subject: 'We’ve published your submission',
  preview: 'Thanks for submitting! Check out your book on Books About Food  '
})
