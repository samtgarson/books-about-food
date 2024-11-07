import { TeamInvite } from '../templates/team-invite'

export function preview() {
  return (
    <TeamInvite
      teamName="Super Awesome Team"
      inviterName="Sam Garson"
      recipientName="Jamin"
    />
  )
}
