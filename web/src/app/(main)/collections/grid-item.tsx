import { Collection } from '@books-about-food/core/models/collection'
import cn from 'classnames'
import Link from 'next/link'
import { CollectionBlobs } from 'src/components/collections/blobs'

function randomRotate() {
  return `${(Math.random() * 4 - 2).toFixed(2)}deg`
}

export function CollectionGridItem({
  collection,
  className
}: {
  collection: Collection
  className?: string
}) {
  const rotate = randomRotate()
  return (
    <li className={cn('relative max-sm:border-b max-sm:bg-white', className)}>
      <Link
        className="flex flex-col flex-wrap items-start gap-1 gap-x-12 bg-white p-6 transition sm:aspect-9/10 sm:rotate-(--rotate) sm:items-center sm:justify-center sm:gap-6 sm:p-9 sm:hover:rotate-[calc(var(--rotate)*-1)]"
        href={collection.href}
        style={{ '--rotate': rotate } as React.CSSProperties}
      >
        <CollectionBlobs colors={collection.colors} />
        <p className="text-18 font-medium sm:text-center">{collection.title}</p>
      </Link>
    </li>
  )
}

export function CollectionGridItemSkeleton({
  className,
  index = 0
}: {
  className?: string
  index?: number
}) {
  const rotate = randomRotate()
  return (
    <li className={cn('relative max-sm:border-b', className)}>
      <div
        className="flex rotate-(--rotate) animate-pulse flex-col flex-wrap items-start gap-1 gap-x-12 bg-white/50 p-6 transition hover:rotate-[calc(--rotate*-1)] sm:aspect-9/10 sm:items-center sm:justify-center sm:gap-6 sm:p-9"
        style={
          {
            animationDelay: `${index * 100}ms`,
            '--rotate': rotate
          } as React.CSSProperties
        }
      >
        <CollectionBlobs colors={[]} />
        <p className="mb-1 h-4 w-40 bg-khaki"></p>
      </div>
    </li>
  )
}
