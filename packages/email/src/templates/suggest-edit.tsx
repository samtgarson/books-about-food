import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import Text from '../components/text'
import { spacing } from '../theme'

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
      <MjmlSection>
        <MjmlColumn>
          <Text>
            You&apos;ve got a new suggestion about a {resourceType} from{' '}
            <strong>{userEmail}</strong>
          </Text>
        </MjmlColumn>
      </MjmlSection>
      <MjmlSection>
        <MjmlColumn
          backgroundColor="white"
          padding={`${spacing.s8}px ${spacing.s7}px`}
        >
          <Text fontWeight="bold">Re: {resourceName}</Text>
          <Text fontStyle="italic">{suggestion}</Text>
          <Button href={url} paddingBottom={0}>
            Edit in Forest
          </Button>
        </MjmlColumn>
      </MjmlSection>
    </BaseLayout>
  )
}
SuggestEdit.subject = 'New suggestion'
