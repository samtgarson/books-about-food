import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import { ProfilePreview } from '../components/profile-preview'
import { Section } from '../components/section'
import Text from '../components/text'

export type NewClaimProps = {
  recipientName: string
  claimId: string
  resourceName: string
  resourceAvatar: string | null
  userEmail: string
}

export const NewClaim: Template<NewClaimProps> = ({
  claimId,
  resourceName,
  resourceAvatar,
  recipientName,
  userEmail
}) => {
  return (
    <BaseLayout recipientName={recipientName}>
      <Section>
        <Text>
          You&apos;ve got a new profile claim to review from: {userEmail}
        </Text>
      </Section>
      <Section white>
        <ProfilePreview
          resourceName={resourceName}
          resourceAvatar={resourceAvatar}
        />
        <Text>
          Look out for a message on Instagram with the three random words.
        </Text>
        <Button
          paddingBottom={0}
          href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/claims/index/record/claims/${claimId}/details?segmentId=1fb02ac5-5335-40f9-b613-ed6678639dc9`}
        >
          View Claim in Admin
        </Button>
      </Section>
    </BaseLayout>
  )
}
NewClaim.subject = 'New claim for review'
