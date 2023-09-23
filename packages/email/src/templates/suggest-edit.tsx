import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import Text from '../components/text'

export type SuggestEditProps = {
  resourceType: string
  resourceName: string
  url: string
  suggestion: string
  userEmail: string
}

const SuggestEdit: Template<SuggestEditProps> = ({
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
            New suggestion from <strong>{userEmail}</strong>!
          </Text>
          <Text fontWeight="bold">{resourceName}</Text>
          <Text fontStyle="italic" fontSize="lg">
            {suggestion}
          </Text>
          <Button href={url}>View and edit {resourceType}</Button>
        </MjmlColumn>
      </MjmlSection>
    </BaseLayout>
  )
}
SuggestEdit.subject = 'New suggestion'
export default SuggestEdit
