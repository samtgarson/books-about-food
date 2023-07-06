import { Container } from 'src/components/atoms/container'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'
import { PageProps } from 'src/components/types'

export const dynamic = 'force-dynamic'

export default async ({ searchParams }: PageProps) => {
  const filters = fetchPublishers.input.parse(searchParams)

  return (
    <>
      <Container belowNav>
        {/* @ts-expect-error RSC */}
        <PublishersList filters={filters} />
      </Container>
    </>
  )
}
