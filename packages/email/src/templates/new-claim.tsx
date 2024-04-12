import { ProfilePreview } from '../components/profile-preview'
import { Section } from '../components/section'
import Text from '../components/text'
import { EmailTemplate } from '../utils/create-template'

type NewClaimProps = {
  claimId: string
  resourceName: string
  resourceAvatar: string | null
  userEmail: string
}

export class NewClaim extends EmailTemplate<NewClaimProps> {
  subject = 'New claim for review'
  preview = 'Review on Forest now'

  content({ claimId, resourceName, resourceAvatar, userEmail }: NewClaimProps) {
    return (
      <Section>
        <Text>
          You&apos;ve got a new profile claim to review from:{' '}
          <a href={`mailto:${userEmail}`}>{userEmail}</a>
        </Text>
        <Text>Click below to view the claim in Forest Admin.</Text>
        <ProfilePreview
          resourceName={resourceName}
          resourceAvatar={resourceAvatar}
          href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/claims/index/record/claims/${claimId}/details?segmentId=1fb02ac5-5335-40f9-b613-ed6678639dc9`}
        />
        <Text>
          Look out for a message on Instagram with the three random words.
        </Text>
      </Section>
    )
  }
}
