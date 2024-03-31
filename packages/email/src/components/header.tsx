import { appUrl } from '@books-about-food/shared/utils/app-url'
import { fontSize, fontWeight } from '../theme'
import Link from './link'
import Text from './text'

export default function Header() {
  return (
    <Text align="left">
      <Link
        fontSize={fontSize.xl}
        fontWeight={fontWeight.bold}
        href={appUrl()}
        textDecoration="none"
      >
        <img src={appUrl('/wordmark.png')} alt="Books About Food" width="180" />
      </Link>
    </Text>
  )
}
