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
    <li className="w-full h-full relative mobile-only:bg-white">
      <Link
        className="bg-white sm:absolute h-full sm:rotate-1 p-6 sm:p-9 flex flex-col gap-1 sm:gap-6 sm:items-center items-start sm:justify-center sm:-inset-3 hover:z-30 transition hover:-rotate-1"
        href={collection.href}
      >
        <p className="all-caps opacity-40">Collection</p>
        <CollectionBlobs colors={collection.colors} />
        <p className="font-medium text-18 sm:text-center">{collection.title}</p>
      </Link>
    </li>
  )
}
