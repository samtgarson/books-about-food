import { Pagination } from 'src/components/lists/pagination'
import {
  fetchPublishers,
  FetchPublishersOptions
} from 'src/services/publishers/fetch'
import { PublishersItem } from './item'

type PublishersListProps = {
  currentPath: string
  filters: FetchPublishersOptions
}

export const PublishersList = async ({
  currentPath,
  filters: { page: pageParam, search }
}: PublishersListProps) => {
  const page = Number(pageParam) || 0
  const { publishers, filteredTotal, total, perPage } = await fetchPublishers({
    page,
    search
  })

  return (
    <>
      <ul className='flex flex-wrap gap-4'>
        {publishers.map((publisher) => (
          <PublishersItem key={publisher.id} publisher={publisher} />
        ))}
      </ul>
      {publishers.length === 0 && <p>No publishers found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={page}
        path={currentPath}
        filteredTotal={filteredTotal}
      />
    </>
  )
}
