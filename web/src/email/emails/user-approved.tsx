import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Text } from '@react-email/components'
import Button from '../components/button'
import { emailTemplate } from '../utils/create-template'

export default emailTemplate({
  component() {
    return (
      <>
        <Text>
          You&apos;re in! Your account has been approved and you can now log
          into Books About Food.
        </Text>
        <Text>Now you have an account you can:</Text>
        <ul className="text-14">
          <li className="mb-2">
            submit cookbooks you’ve worked on (or ones you’d like to see on the
            website)
          </li>
          <li className="mb-2">
            claim your profile (if you’ve been part of a cookbook)
          </li>
          <li className="mb-2">
            more features coming soon (we’ll keep you posted)
          </li>
        </ul>
        <Text>Click the button below to take a look.</Text>
        <Button href={appUrl()}>Show me some cookbooks</Button>
      </>
    )
  },
  previewProps: {},
  subject: 'Welcome to Books About Food!',
  preview: "You're off the waiting list"
})
