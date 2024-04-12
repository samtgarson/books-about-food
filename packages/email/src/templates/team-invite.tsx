import { appUrl } from '@books-about-food/shared/utils/app-url'
import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { EmailTemplate } from '../utils/create-template'

type TeamInviteProps = {
  teamName: string
  inviterName: string
}

export class TeamInvite extends EmailTemplate<TeamInviteProps> {
  content({ teamName, inviterName }: TeamInviteProps) {
    return (
      <Section>
        <Text>
          {inviterName} has invited you to join the team{' '}
          <strong>{teamName}</strong> on Books About Food.
        </Text>
        <Text>Click below to view your profile on the website.</Text>
        <Button href={appUrl('/account')}>View and accept invite</Button>
        <Text>
          We hope you&apos;ll find Books About Food to be a useful resource and
          we&apos;d love to hear your feedback.
        </Text>
      </Section>
    )
  }

  subject = "You've got a new invite"
  preview = ({ teamName }: Partial<TeamInviteProps>) =>
    `You've been invited to join ${teamName} on Books About Food`
}
