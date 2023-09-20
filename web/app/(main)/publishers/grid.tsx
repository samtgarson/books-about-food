import cn from 'classnames'
import { FC } from 'react'
import Link from 'next/link'
import { GridContainer } from 'src/components/lists/grid-container'
import { PublishersItem } from './item'
import { Publisher } from 'src/models/publisher'

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
      !square && 'sm:!flex sm:flex-row flex-wrap'
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
            'border border-black flex justify-center items-center bg-white text-16 sm:text-24 p-6 border-b text-center -mr-px sm:-mb-px',
            square && 'sm:aspect-square'
          )}
          href={viewMoreLink.path}
        >
          {viewMoreLink.label}
        </Link>
      </li>
    )}
  </GridContainer>
)
