import type {
  DefaultCellComponentProps,
  DefaultServerCellComponentProps,
  Payload
} from 'payload'

type CustomTitleCellProps = DefaultCellComponentProps &
  DefaultServerCellComponentProps & {
    imageAttributeName: string
    imageShape?: 'cover' | 'square' | 'round'
    directSrc?: boolean
  }

async function getImageSrc(
  payload: Payload,
  directSrc: boolean | undefined,
  imageID: string | undefined | null
) {
  if (directSrc) return imageID
  if (!imageID) return null

  const img = await payload.findByID({
    collection: 'images',
    id: imageID
  })
  return img?.thumbnailURL || null
}

export default async function CustomTitleCell({
  cellData: title,
  rowData,
  payload,
  imageAttributeName,
  imageShape = 'cover',
  collectionSlug,
  directSrc
}: CustomTitleCellProps) {
  if (!title || typeof title !== 'string') return null

  const thumbnailURL = await getImageSrc(
    payload,
    directSrc,
    rowData[imageAttributeName]
  )

  return (
    <a
      style={{ display: 'flex', gap: 16, textDecoration: 'none' }}
      href={`/admin/collections/${collectionSlug}/${rowData.id}`}
    >
      {thumbnailURL ? (
        <img
          className="image-cell"
          src={thumbnailURL}
          alt=""
          style={{
            width: 40,
            height: 40,
            objectFit: imageShape === 'cover' ? 'contain' : 'cover',
            borderRadius: imageShape === 'round' ? 100 : 0
          }}
        />
      ) : (
        <span
          style={{
            marginInline: imageShape === 'cover' ? 5 : 0,
            width: imageShape === 'cover' ? 30 : 40,
            height: 40,
            backgroundColor: 'var(--theme-elevation-200)',
            borderRadius: imageShape === 'round' ? 100 : 0
          }}
        />
      )}
      <span style={{ fontWeight: 'bold' }}>{title}</span>
    </a>
  )
}
