import { appUrl } from '@books-about-food/shared/utils/app-url'
import { ProfilePreview } from '../components/profile-preview'
import { Section } from '../components/section'
import Text from '../components/text'
import { createTemplate } from '../utils/create-template'

type ClaimApprovedProps = {
  profileName: string
  profileSlug: string
  profileAvatarUrl?: string | null
  author: boolean
}

export const ClaimApproved = createTemplate<ClaimApprovedProps>({
  subject: 'Welcome to Books About Food!',
  preview: "We've approved your claim, go manage your profile now",
  content({ profileName, profileSlug, profileAvatarUrl, author }) {
    return (
      <Section>
        <Text>
          Congrats! 🎉 We&apos;ve approved your claim and you can now log in and
          manage your profile on Books About Food.
        </Text>
        <Text>Click below to view your profile on the website.</Text>
        <ProfilePreview
          href={appUrl(`${author ? 'authors' : 'people'}/${profileSlug}`)}
          resourceName={profileName}
          resourceAvatar={profileAvatarUrl ?? null}
        />
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
      </Section>
    )
  }
})
