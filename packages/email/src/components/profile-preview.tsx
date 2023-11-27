import { colors } from '../theme'
import Text from './text'

export function ProfilePreview({
  resourceName,
  resourceAvatar
}: {
  resourceName: string
  resourceAvatar: string | null
}) {
  return (
    <Text>
      <div
        style={{
          border: '1px solid #000',
          padding: '10px 20px 10px 10px',
          width: 'fit-content'
        }}
      >
        {resourceAvatar ? (
          <img
            src={resourceAvatar}
            alt={resourceName}
            width={30}
            height={30}
            style={{
              borderRadius: '30px',
              verticalAlign: 'middle',
              marginRight: '16px'
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
              verticalAlign: 'middle'
            }}
          />
        )}
        {resourceName}
      </div>
    </Text>
  )
}
