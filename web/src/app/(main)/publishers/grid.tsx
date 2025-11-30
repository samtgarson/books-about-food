import { Publisher } from '@books-about-food/core/models/publisher'
import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { GridContainer } from 'src/components/lists/grid-container'
import { PublishersItem } from './item'

export type PublisherListProps = {
  publishers: Publisher[]
  className?: string
  square?: boolean
  viewMoreLink?: { path: string; label: string }
}

export const PublisherGrid: FC<PublisherListProps> = ({
  publishers,
  className,
  square = true,
  viewMoreLink
}) => (
  <GridContainer
    className={cn(
      'transition-opacity',
      className,
      !square && 'flex-wrap sm:flex! sm:flex-row'
    )}
  >
    {publishers.map((publisher) => (
      <PublishersItem
        key={publisher.id}
        publisher={publisher}
        square={square}
      />
    ))}
    {viewMoreLink && (
      <li>
        <Link
          className={cn(
            '-mr-px flex items-center justify-center border border-b border-black bg-white p-6 text-center text-16 sm:-mb-px sm:text-24',
            square ? 'sm:aspect-square' : 'h-20'
          )}
          href={viewMoreLink.path}
        >
          {viewMoreLink.label}
        </Link>
      </li>
    )}
  </GridContainer>
)
