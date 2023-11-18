import { NewClaim } from '../templates/new-claim'

export function preview() {
  return (
    <NewClaim
      recipientName="Jamin"
      claimId="claim id"
      resourceName="Sam Garson"
      resourceAvatar="https://lh3.googleusercontent.com/a/ACg8ocJmKfH3mDo6nLnzYSkLiHL8DvuDTIvnkpZQ0FLCEm2BXTpQ=s96-c"
      userEmail="samtgarson@gmail.com"
    />
  )
}
