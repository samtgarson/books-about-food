import { Publisher } from 'database'
import Link from 'next/link'
import cn from 'classnames'

export type PublishersItemProps = {
  publisher: Publisher
  square?: boolean
}

export const PublishersItem = ({
  publisher,
  square = true
}: PublishersItemProps) => (
  <li className={cn('sm:-mr-px -mb-px last:mb-0 sm:last:-mb-px')}>
    <Link
      href={`/publishers/${publisher.slug}`}
      className={cn(
        'w-full border border-black flex justify-center items-center p-6 text-center text-18 sm:text-24',
        square && 'h-full sm:aspect-square'
      )}
    >
      <p>{publisher.name}</p>
    </Link>
  </li>
)
