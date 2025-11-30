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
        <Column className="w-[40px] border border-solid border-y-black border-r-transparent p-4 pr-0">
          {resourceAvatar ? (
            <img
              src={resourceAvatar}
              alt={resourceName}
              width={30}
              height={30}
              className="rounded-full object-cover align-middle"
            />
          ) : (
            <div className="mr-4 ml-[-4px] inline-block h-[30px] w-[30px] rounded-[30px] bg-sand align-middle" />
          )}
        </Column>
        <Column className="border border-solid border-y-black border-l-transparent p-4 whitespace-nowrap">
          {resourceName}
        </Column>
        <Column className="w-0 md:w-full" />
      </Row>
    </a>
  )
}
