import { colors } from '../theme'
import Button from './button'

export function BookPreview({
  title,
  cover,
  author,
  href
}: {
  title: string
  author: string
  cover: string | null
  href?: string
}) {
  return (
    <Button href={href}>
      <table>
        <tr>
          <td rowSpan={2}>
            {cover ? (
              <img
                src={cover}
                alt={title}
                width={47}
                height={62}
                style={{
                  verticalAlign: 'middle',
                  marginRight: '16px',
                  marginLeft: '-4px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  display: 'inline-block',
                  width: '47px',
                  height: '62px',
                  borderRadius: '30px',
                  backgroundColor: colors.sand,
                  marginRight: '16px',
                  marginLeft: '-4px',
                  verticalAlign: 'middle'
                }}
              />
            )}
          </td>
          <td height={30}>
            <strong>{title}</strong>
          </td>
        </tr>
        <tr>
          <td height={30}>{author}</td>
        </tr>
      </table>
    </Button>
  )
}
