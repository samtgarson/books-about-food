import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Text } from '@react-email/components'
import { ProfilePreview } from '../components/profile-preview'
import { WhiteSection } from '../components/white-section'
import { emailTemplate } from '../utils/create-template'

type ClaimApprovedProps = {
  profileName: string
  profileSlug: string
  profileAvatarUrl?: string | null
  author: boolean
}

export default emailTemplate({
  component({
    profileName,
    profileSlug,
    profileAvatarUrl,
    author
  }: ClaimApprovedProps) {
    return (
      <>
        <Text>
          Congrats! 🎉 We&apos;ve approved your claim and you can now log in and
          manage your profile on Books About Food.
        </Text>
        <WhiteSection>
          <Text>Click below to view your profile on the website.</Text>
          <ProfilePreview
            href={appUrl(`${author ? 'authors' : 'people'}/${profileSlug}`)}
            resourceName={profileName}
            resourceAvatar={profileAvatarUrl ?? null}
          />
        </WhiteSection>
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
      </>
    )
  },
  previewProps: {
    profileName: 'Joe Bloggs',
    profileSlug: 'joe',
    profileAvatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocJmKfH3mDo6nLnzYSkLiHL8DvuDTIvnkpZQ0FLCEm2BXTpQ=s96-c',
    author: true
  },
  subject: 'Welcome to Books About Food!',
  preview: "We've approved your claim, go manage your profile now          "
})
