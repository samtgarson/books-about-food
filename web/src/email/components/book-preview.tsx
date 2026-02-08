import { Column, Row } from '@react-email/components'

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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline"
    >
      <Row className="border border-solid border-black">
        <Column className="w-[50px] bg-white p-4 pr-0">
          {cover ? (
            <img
              src={cover}
              alt={title}
              width={47}
              height={62}
              className="object-cover align-middle"
            />
          ) : (
            <div className="mr-4 ml-[-4px] inline-block h-[62px] w-[47px] rounded-[30px] bg-sand align-middle" />
          )}
        </Column>
        <Column className="mr-auto bg-white p-4">
          <div className="mb-2 block">
            <strong>{title}</strong>
          </div>
          <div>{author}</div>
        </Column>
      </Row>
    </a>
  )
}
