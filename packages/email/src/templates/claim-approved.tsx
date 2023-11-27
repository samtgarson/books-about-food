import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
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
      </Section>
      <Section white>
        <ProfilePreview
          resourceName={profileName}
          resourceAvatar={profileAvatarUrl ?? null}
        />
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
        <Button
          href={`https://booksaboutfood.info/${
            author ? 'authors' : 'people'
          }/${profileSlug}`}
          paddingBottom={0}
        >
          Go to your profile
        </Button>
      </Section>
    </BaseLayout>
  )
}
ClaimApproved.subject = 'Welcome to Books About Food!'
