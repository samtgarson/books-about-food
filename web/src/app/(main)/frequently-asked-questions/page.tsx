import prisma from '@books-about-food/database'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Faqs } from 'src/components/home/faqs'
import { genMetadata } from 'src/utils/metadata'

export const metadata = genMetadata('/frequently-asked-questions', null, {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Books About Food.'
})

export {
  dynamic,
  dynamicParams,
  revalidate
} from 'src/app/default-static-config'

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
