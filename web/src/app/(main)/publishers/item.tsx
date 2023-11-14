import { Publisher } from '@books-about-food/core/models/publisher'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

export type PublishersItemProps = {
  publisher: Publisher
  square?: boolean
}

export const PublishersItem = ({
  publisher,
  square = true
}: PublishersItemProps) => (
  <li className={cn('-mb-px last:mb-0 sm:-mr-px sm:last:-mb-px')}>
    <Link
      href={`/publishers/${publisher.slug}`}
      className={cn(
        'text-18 sm:text-24 flex w-full items-center justify-center border border-black p-6 text-center',
        square ? 'h-full sm:aspect-square' : 'h-20'
      )}
    >
      {publisher.logo ? (
        <Image
          {...publisher.logo.imageAttrs(40)}
          className={cn(
            'w-[140px] object-contain object-center mix-blend-darken',
            square ? 'h-[140px]' : 'h-full'
          )}
        />
      ) : (
        <p>{publisher.name}</p>
      )}
    </Link>
  </li>
)
