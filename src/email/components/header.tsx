import { Text } from '@react-email/components'
import { appUrl } from '../../utils/app-url'
import { assetUrl } from '../utils/url'

export default function Header() {
  return (
    <Text>
      <a className="text-18 font-medium no-underline" href={appUrl()}>
        <img
          src={assetUrl('/wordmark.png')}
          alt="Books About Food"
          width="180"
        />
      </a>
    </Text>
  )
}
