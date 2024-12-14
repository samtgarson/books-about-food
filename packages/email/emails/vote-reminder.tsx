import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Text } from '@react-email/components'
import Button from '../components/button'
import { emailTemplate } from '../utils/create-template'

export default emailTemplate({
  subject: "Don't forget to submit your votes for the 2024 Top Ten",
  preview: 'Submit your votes to get entered into the prize draw.',

  component() {
    return (
      <>
        <Text>
          You started voting for the 2024 Top Ten but haven&apos;t submitted
          your votes yet. Don&apos;t forget to submit them to ensure you&apos;re
          entered in the prize draw!
        </Text>
        <Text>
          We&apos;ve saved your votes, all you have to do is hit submit ✨
        </Text>
        <Button href={appUrl('/top-ten/2024')}>Submit your votes</Button>
      </>
    )
  },
  previewProps: {}
})
