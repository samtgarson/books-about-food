import prisma from 'database'
import { Metadata } from 'next'
import * as Accordion from 'src/components/atoms/accordion'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions'
}

export default async function FrequentlyAskedQuestions() {
  const questions = await prisma.frequentlyAskedQuestion.findMany()

  return (
    <Container belowNav>
      <PageTitle>Frequently Asked Questions</PageTitle>
      <Accordion.Root type="multiple">
        {questions.map(({ question, id, answer }) => (
          <Accordion.Item title={question} value={id} key={id}>
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Container>
  )
}
