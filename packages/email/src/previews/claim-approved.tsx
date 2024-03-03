import { ClaimApproved } from '../templates/claim-approved'

export function author() {
  return (
    <ClaimApproved
      recipientName="Joe"
      profileName="Joe Bloggs"
      profileSlug="joe"
      profileAvatarUrl="https://lh3.googleusercontent.com/a/ACg8ocJmKfH3mDo6nLnzYSkLiHL8DvuDTIvnkpZQ0FLCEm2BXTpQ=s96-c"
      author
    />
  )
}

export function profile() {
  return (
    <ClaimApproved
      recipientName="Joe"
      profileName="Joe Bloggs"
      profileSlug="joe"
      author={false}
    />
  )
}
