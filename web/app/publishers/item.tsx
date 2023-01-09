import { Publisher } from 'database'
import Link from 'next/link'

export type PublishersItemProps = {
  publisher: Publisher
}

export const PublishersItem = ({ publisher }: PublishersItemProps) => (
  <li>
    <Link href={`/publishers/${publisher.slug}`}>
      <p>{publisher.name}</p>
    </Link>
  </li>
)
