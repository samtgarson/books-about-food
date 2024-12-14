import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Text } from '@react-email/components'
import Button from '../components/button'
import { emailTemplate } from '../utils/create-template'

type PublisherInviteProps = {
  publisherName: string
  inviterName: string
}

export default emailTemplate({
  component({ publisherName, inviterName }: PublisherInviteProps) {
    return (
      <>
        <Text>
          {inviterName} has invited you to edit the publisher{' '}
          <strong>{publisherName}</strong> on Books About Food.
        </Text>
        <Text>Click below to view your invitation on the website.</Text>
        <Button href={appUrl('/account')}>View and accept invite</Button>
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
      </>
    )
  },
  previewProps: {
    publisherName: 'Super Awesome Publisher',
    inviterName: 'Sam Garson'
  },
  subject: "You've got a new invite",
  preview: ({ publisherName }: Partial<PublisherInviteProps>) =>
    `You've been invited to edit ${publisherName} on Books About Food`
})
