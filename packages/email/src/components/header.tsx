import { fontSize, fontWeight } from '../theme'
import Link from './link'
import Text from './text'

export default function Header() {
  return (
    <Text align="left">
      <Link
        fontSize={fontSize.xl}
        fontWeight={fontWeight.bold}
        href="https://www.booksaboutfood.info"
        textDecoration="none"
      >
        <img
          src="https://www.booksaboutfood.info/wordmark.png"
          alt="Books About Food"
          width="180"
        />
      </Link>
    </Text>
  )
}
