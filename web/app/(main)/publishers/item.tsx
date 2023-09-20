import Link from 'next/link'
import cn from 'classnames'
import { Publisher } from 'src/models/publisher'
import Image from 'next/image'

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
        square ? 'h-full sm:aspect-square' : 'h-20'
      )}
    >
      {publisher.logo ? (
        <Image
          {...publisher.logo.imageAttrs(40)}
          className="mix-blend-darken w-[140px] h-[50px] object-contain object-center"
        />
      ) : (
        <p>{publisher.name}</p>
      )}
    </Link>
  </li>
)
