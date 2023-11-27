import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'

export type UserApprovedProps = { userName?: string | null }

export const UserApproved: Template<UserApprovedProps> = ({ userName }) => {
  return (
    <BaseLayout preview="You're in!" recipientName={userName ?? undefined}>
      <Section>
        <Text>
          You&apos;re in! Your account has been approved and you can now log
          into Books About Food.
        </Text>
        <Text>
          If you&apos;ve worked on a cookbook, you can submit it for review and
          claim your profile.
        </Text>
        <Text>Click the button below to take a look.</Text>
        <Button href="https://booksaboutfood.info">
          Show me some cookbooks
        </Button>
      </Section>
    </BaseLayout>
  )
}
UserApproved.subject = 'Welcome to Books About Food!'
