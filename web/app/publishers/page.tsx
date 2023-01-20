import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export default async () => {
  const data = await fetchPublishers.call()

  return (
    <>
      <PageTitle>Publishers</PageTitle>
      <Container>
        <PublishersList fallback={data} data-superjson />
      </Container>
    </>
  )
}
