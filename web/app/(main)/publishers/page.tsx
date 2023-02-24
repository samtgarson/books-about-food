import { Container } from 'src/components/atoms/container'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export * from 'app/default-static-config'

export default async () => {
  const data = await fetchPublishers.call()

  return (
    <>
      <Container belowNav>
        <PublishersList fallback={data} data-superjson />
      </Container>
    </>
  )
}
