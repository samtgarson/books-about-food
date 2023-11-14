import { VerifyEmail } from '../templates/verify-email'

const url =
  'http://booksaboutfood.info/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A5000%2Faccount&token=f16dc233cd515c03e4e7e47ed92c9bd7680ac0884dcfdfc180678b755b77bdff&email=samtgarson%40gmail.com'

export function existingUser() {
  return <VerifyEmail url={url} />
}

export function newUser() {
  return <VerifyEmail url={url} newUser />
}
