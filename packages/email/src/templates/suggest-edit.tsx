import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { createTemplate } from '../utils/create-template'

export type SuggestEditProps = {
  resourceType: string
  resourceName: string
  url: string
  suggestion: string
  userEmail: string
}

export const SuggestEdit = createTemplate<SuggestEditProps>({
  subject: 'New suggestion',
  preview: ({ resourceName }) => `New suggestion for ${resourceName}`,
  content({ resourceType, url, suggestion, resourceName, userEmail }) {
    return (
      <>
        <Section>
          <Text>
            You&apos;ve got a new suggestion about a {resourceType} from{' '}
            <a href={`mailto:${userEmail}`}>{userEmail}</a>
          </Text>
          <Text fontWeight="bold">Re: {resourceName}</Text>
        </Section>
        <Section box paddingBottom={0}>
          <Text fontStyle="italic">{suggestion}</Text>
        </Section>
        <Section>
          <Button href={url} paddingBottom={0}>
            Edit {resourceType} in Forest
          </Button>
        </Section>
      </>
    )
  }
})
