import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export * from 'app/default-static-config'

export default async () => {
  const data = await fetchPublishers.call()

  return (
    <>
      <Container belowNav>
        <PageTitle>Publishers</PageTitle>
        <PublishersList fallback={data} data-superjson />
      </Container>
    </>
  )
}
