import { Text } from '@react-email/components'
import { ProfilePreview } from '../components/profile-preview'
import { WhiteSection } from '../components/white-section'
import { emailTemplate } from '../utils/create-template'

type NewClaimProps = {
  claimId: string
  resourceName: string
  resourceAvatar: string | null
  userEmail: string
}

export default emailTemplate({
  component({
    claimId,
    resourceName,
    resourceAvatar,
    userEmail
  }: NewClaimProps) {
    return (
      <>
        <Text>
          You&apos;ve got a new profile claim to review from:{' '}
          <a href={`mailto:${userEmail}`}>{userEmail}</a>
        </Text>
        <WhiteSection>
          <Text>Click below to view the claim in Forest Admin.</Text>
          <ProfilePreview
            resourceName={resourceName}
            resourceAvatar={resourceAvatar}
            href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/claims/index/record/claims/${claimId}/details?segmentId=1fb02ac5-5335-40f9-b613-ed6678639dc9`}
          />
        </WhiteSection>
        <Text>
          Look out for a message on Instagram with the three random words.
        </Text>
      </>
    )
  },
  previewProps: {
    claimId: 'claim id',
    resourceName: 'Sam Garson',
    resourceAvatar:
      'https://lh3.googleusercontent.com/a/ACg8ocJmKfH3mDo6nLnzYSkLiHL8DvuDTIvnkpZQ0FLCEm2BXTpQ=s96-c',
    userEmail: 'samtgarson@gmail.com'
  },
  subject: 'New claim for review',
  preview: 'Review on Forest now'
})
