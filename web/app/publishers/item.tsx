import { Publisher } from 'database'
import Link from 'next/link'

export type PublishersItemProps = {
  publisher: Publisher
}

export const PublishersItem = ({ publisher }: PublishersItemProps) => (
  <li className="aspect-square -mr-px -mb-px">
    <Link
      href={`/publishers/${publisher.slug}`}
      className="w-full h-full border border-black flex justify-center items-center p-8 text-center"
    >
      <p>{publisher.name}</p>
    </Link>
  </li>
)
