import { Column, Row, Text } from '@react-email/components'
import Button from '../components/button'
import { emailTemplate } from '../utils/create-template'

export type SuggestEditProps = {
  resourceType: string
  resourceName: string
  url: string
  suggestion: string
  userEmail: string
}

const url = 'https://google.com'
const resourceName = 'Resource Name'
const suggestion =
  "I think you're missing Harry Styles from the team, he designed the front cover."
const userEmail = 'imnotharry@styles.com'

export default emailTemplate({
  component({
    resourceType,
    url,
    suggestion,
    resourceName,
    userEmail
  }: SuggestEditProps) {
    return (
      <>
        <Text>
          You&apos;ve got a new suggestion about a {resourceType} from{' '}
          <a href={`mailto:${userEmail}`}>{userEmail}</a>
        </Text>
        <Row>
          <Column className="bg-white p-6 pt-0">
            <Text className="font-medium">
              Re:
              {resourceName}
            </Text>
            <Text className="border-grey border border-solid p-4 italic">
              {suggestion}
            </Text>
            <Button href={url}>
              Edit
              {resourceType} in Forest
            </Button>
          </Column>
        </Row>
      </>
    )
  },
  previewProps: {
    resourceName,
    resourceType: 'book',
    suggestion,
    url,
    userEmail
  },
  subject: 'New suggestion',
  preview: ({ resourceName }) => `New suggestion for ${resourceName}`
})
