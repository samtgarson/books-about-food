import { Column, Row } from '@react-email/components'

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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline"
    >
      <Row className="bg-white">
        <Column className="w-[40px] p-4 pr-0 border border-y-black border-r-transparent border-solid">
          {resourceAvatar ? (
            <img
              src={resourceAvatar}
              alt={resourceName}
              width={30}
              height={30}
              className="rounded-full object-cover align-middle"
            />
          ) : (
            <div className="inline-block w-[30px] h-[30px] rounded-[30px] bg-sand mr-4 ml-[-4px] align-middle" />
          )}
        </Column>
        <Column className="p-4 whitespace-nowrap border border-l-transparent border-y-black border-solid">
          {resourceName}
        </Column>
        <Column className="w-0 md:w-full" />
      </Row>
    </a>
  )
}
