import VerifyEmail from '../templates/verify-email'

export function existingUser() {
  return <VerifyEmail url="https://booksaboutfood.info" />
}

export function newUser() {
  return <VerifyEmail url="https://booksaboutfood.info" newUser />
}
