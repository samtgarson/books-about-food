import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { EmailTemplate } from '../utils/create-template'

export type SuggestEditProps = {
  resourceType: string
  resourceName: string
  url: string
  suggestion: string
  userEmail: string
}

export class SuggestEdit extends EmailTemplate<SuggestEditProps> {
  subject = 'New suggestion'
  preview = ({ resourceName }: Partial<SuggestEditProps>) =>
    `New suggestion for ${resourceName}`

  content({
    resourceType,
    url,
    suggestion,
    resourceName,
    userEmail
  }: SuggestEditProps) {
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
}
