import NewClaim from '../templates/new-claim'

export function preview() {
  return (
    <NewClaim
      recipientName="Jamin"
      claimId="claim id"
      resourceName="Sam Garson"
      resourceAvatar="https://books-about-food-web.vercel.app/_next/image?url=https%3A%2F%2Fd3ejpjognsw7p1.cloudfront.net%2Fprofile-avatars%2Feaac523d-309b-4ca7-85c3-9da7e2e43bbb%2Ff043dc97-2474-4080-bdb0-932481aaa13f.jpeg&w=640&q=75"
      type="profile"
    />
  )
}
