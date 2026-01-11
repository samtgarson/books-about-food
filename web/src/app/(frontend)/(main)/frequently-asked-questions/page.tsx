import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Faqs } from 'src/components/home/faqs'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { genMetadata } from 'src/utils/metadata'

export const metadata = genMetadata('/frequently-asked-questions', null, {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Books About Food.'
})

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

export default async function FrequentlyAskedQuestions() {
  const payload = await getPayloadClient()
  const { docs: faqs } = await payload.find({
    collection: 'faqs',
    sort: 'question',
    pagination: false
  })

  // Map Payload FAQs to Prisma-compatible format for client component
  const questions = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    // Convert rich text to string for legacy component
    answer:
      typeof faq.answer === 'object'
        ? JSON.stringify(faq.answer)
        : (faq.answer ?? ''),
    updatedAt: new Date(faq.updatedAt),
    createdAt: new Date(faq.createdAt)
  }))

  return (
    <Container belowNav>
      <PageTitle>Frequently Asked Questions</PageTitle>
      <Faqs questions={questions} />
    </Container>
  )
}
