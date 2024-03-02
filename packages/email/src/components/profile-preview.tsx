import { colors } from '../theme'
import Button from './button'

export function ProfilePreview({
  resourceName,
  resourceAvatar,
  href
}: {
  resourceName: string
  resourceAvatar: string | null
  href?: string
}) {
  return (
    <Button href={href}>
      {resourceAvatar ? (
        <img
          src={resourceAvatar}
          alt={resourceName}
          width={30}
          height={30}
          style={{
            borderRadius: '30px',
            verticalAlign: 'middle',
            marginRight: '16px',
            marginLeft: '-4px'
          }}
        />
      ) : (
        <div
          style={{
            display: 'inline-block',
            width: '30px',
            height: '30px',
            borderRadius: '30px',
            backgroundColor: colors.sand,
            marginRight: '16px',
            marginLeft: '-4px',
            verticalAlign: 'middle'
          }}
        />
      )}
      {resourceName}
    </Button>
  )
}
