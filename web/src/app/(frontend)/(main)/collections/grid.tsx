import {
  fetchCollections,
  FetchCollectionsInput
} from '@books-about-food/core/services/collections/fetch-collections'
import { PageTitle } from 'src/components/atoms/page-title'
import { GridContainer } from 'src/components/lists/grid-container'
import { Pagination } from 'src/components/lists/pagination'
import { call } from 'src/utils/service'
import { CollectionGridItem, CollectionGridItemSkeleton } from './grid-item'

export async function CollectionsGrid({
  filters
}: {
  filters: FetchCollectionsInput
}) {
  const { data, success } = await call(fetchCollections, filters)
  if (!success) return null

  const { collections, total, perPage } = data

  return (
    <>
      <PageTitle>All Collections</PageTitle>
      <Pagination total={total} perPage={perPage} page={filters.page ?? 0}>
        <GridContainer className="max-sm:border-t sm:gap-9">
          {collections.map((collection) => (
            <CollectionGridItem key={collection.id} collection={collection} />
          ))}
        </GridContainer>
      </Pagination>
    </>
  )
}

export async function CollectionsSkeletonGrid() {
  return (
    <>
      <PageTitle>All Collections</PageTitle>
      <Pagination total={24} perPage={12} page={0}>
        <GridContainer className="max-sm:border-t sm:gap-9">
          {[...Array(12)].map((_, i) => (
            <CollectionGridItemSkeleton key={i} index={i} />
          ))}
        </GridContainer>
      </Pagination>
    </>
  )
}
