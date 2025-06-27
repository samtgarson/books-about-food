import { fetchCollections } from '@books-about-food/core/services/collections/fetch-collections'
import Link from 'next/link'
import { call } from 'src/utils/service'
import { CollectionBlobs } from './blobs'

export type CollectionGridTileProps = { index: number }
export async function CollectionGridTile({ index }: CollectionGridTileProps) {
  const { data } = await call(fetchCollections, { page: index, perPage: 1 })
  const collection = data?.[0]

  if (!collection) return null
  return (
    <li className="grid-container:aspect-square relative h-full w-full max-sm:bg-white sm:aspect-square">
      <Link
        className="flex h-full flex-col flex-wrap items-start gap-1 gap-x-12 bg-white p-6 transition hover:z-30 hover:-rotate-1 sm:absolute sm:-inset-3 sm:rotate-1 sm:items-center sm:justify-center sm:gap-6 sm:p-9"
        href={collection.href}
      >
        <p className="all-caps opacity-40">Collection</p>
        <CollectionBlobs colors={collection.colors} />
        <p className="text-18 font-medium sm:text-center">{collection.title}</p>
      </Link>
    </li>
  )
}
