import { Container } from 'src/components/atoms/container'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export * from 'app/default-static-config'

export default async ({ searchParams }) => {
  const filters = fetchPublishers.input.parse(searchParams)

  return (
    <>
      <Container belowNav>
        <PublishersList filters={filters} />
      </Container>
    </>
  )
}
