import { appUrl } from '@books-about-food/shared/utils/app-url'
import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { EmailTemplate } from '../utils/create-template'

export class UserApproved extends EmailTemplate {
  static key = 'userApproved' as const
  subject = 'Welcome to Books About Food!'
  preview = "You're off the waiting list"

  content() {
    return (
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
        <Button href={appUrl()}>Show me some cookbooks</Button>
      </Section>
    )
  }
}
