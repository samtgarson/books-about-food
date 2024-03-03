import prisma from '@books-about-food/database'
import { Metadata } from 'next'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Faqs } from 'src/components/home/faqs'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  alternates: {
    canonical: '/frequently-asked-questions'
  }
}

export * from 'src/app/default-static-config'

export default async function FrequentlyAskedQuestions() {
  const questions = await prisma.frequentlyAskedQuestion.findMany({
    orderBy: { question: 'asc' }
  })

  return (
    <Container belowNav>
      <PageTitle>Frequently Asked Questions</PageTitle>
      <Faqs questions={questions} />
    </Container>
  )
}
