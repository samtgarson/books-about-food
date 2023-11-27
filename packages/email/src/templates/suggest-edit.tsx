import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'

export type SuggestEditProps = {
  resourceType: string
  resourceName: string
  url: string
  suggestion: string
  userEmail: string
}

export const SuggestEdit: Template<SuggestEditProps> = ({
  resourceType,
  url,
  suggestion,
  resourceName,
  userEmail
}) => {
  return (
    <BaseLayout preview="Verify your email address">
      <Section>
        <Text>
          You&apos;ve got a new suggestion about a {resourceType} from{' '}
          <strong>{userEmail}</strong>
        </Text>
      </Section>
      <Section white>
        <Text fontWeight="bold">Re: {resourceName}</Text>
        <Text fontStyle="italic">{suggestion}</Text>
        <Button href={url} paddingBottom={0}>
          Edit in Forest
        </Button>
      </Section>
    </BaseLayout>
  )
}
SuggestEdit.subject = 'New suggestion'
