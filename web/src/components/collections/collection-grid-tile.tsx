import { fetchCollections } from '@books-about-food/core/services/collections/fetch-collections'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { ArrowUpRight } from 'src/components/atoms/icons'
import { range } from 'src/utils/array-helpers'
import { call } from 'src/utils/service'

export type CollectionGridTileProps = { index: number }
export async function CollectionGridTile({ index }: CollectionGridTileProps) {
  const { data } = await call(fetchCollections, { page: index, perPage: 1 })
  const collection = data?.[0]

  if (!collection) return null
  return (
    <li className="w-full h-full relative">
      <Link
        className="bg-white sm:absolute sm:rotate-1 p-6 sm:p-9 flex flex-col gap-1 sm:gap-6 sm:items-center items-start sm:justify-center sm:-inset-3 hover:z-30 transition hover:-rotate-1"
        href={collection.href}
      >
        <p className="all-caps opacity-40">Cookbook Collection</p>
        <div className="grid grid-cols-6 sm:grid-cols-4 mobile-only:order-last mobile-only:mt-3">
          {range(12).map((i) => (
            <div
              key={i}
              className="size-8 sm:size-10 rounded-full bg-grey"
              style={blobStyle(collection.colors[i])}
            />
          ))}
        </div>
        <p className="font-medium text-18">{collection.title}</p>
        <ArrowUpRight
          strokeWidth={1}
          size={32}
          className="absolute mobile-only:right-8 mobile-only:top-6 sm:relative"
        />
      </Link>
    </li>
  )
}

function blobStyle(color?: string): CSSProperties {
  if (!color) return {}
  return { backgroundColor: color }
}
