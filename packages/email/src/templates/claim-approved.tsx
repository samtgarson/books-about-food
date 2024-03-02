import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import { ProfilePreview } from '../components/profile-preview'
import { Section } from '../components/section'
import Text from '../components/text'

export type ClaimApprovedProps = {
  profileName: string
  profileSlug: string
  profileAvatarUrl?: string | null
  author: boolean
}

export const ClaimApproved: Template<ClaimApprovedProps> = ({
  profileName,
  profileSlug,
  profileAvatarUrl,
  author
}) => {
  return (
    <BaseLayout preview="You're in!" recipientName={profileName}>
      <Section>
        <Text>
          Congrats! 🎉 We&apos;ve approved your claim and you can now log in and
          manage your profile on Books About Food.
        </Text>
        <Text>Click below to view your profile on the website.</Text>
        <ProfilePreview
          href={`https://booksaboutfood.info/${
            author ? 'authors' : 'people'
          }/${profileSlug}`}
          resourceName={profileName}
          resourceAvatar={profileAvatarUrl ?? null}
        />
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
      </Section>
    </BaseLayout>
  )
}
ClaimApproved.subject = 'Welcome to Books About Food!'
