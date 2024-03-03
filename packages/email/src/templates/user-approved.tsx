import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { createTemplate } from '../utils/create-template'

export const UserApproved = createTemplate({
  subject: 'Welcome to Books About Food!',
  preview: "You're off the waiting list",
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
        <Button href="https://booksaboutfood.info">
          Show me some cookbooks
        </Button>
      </Section>
    )
  }
})
