import { UserRole } from '@books-about-food/database'
import { DefaultSession } from 'next-auth'

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    userId: string
    role: UserRole
  }
}

declare module 'next-auth' {
  interface User extends DefaultSession['user'] {
    role: UserRole
  }
}

/** [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page) */
export type SignInErrorTypes =
  | 'Signin'
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'EmailCreateAccount'
  | 'Callback'
  | 'OAuthAccountNotLinked'
  | 'EmailSignin'
  | 'CredentialsSignin'
  | 'SessionRequired'
  | 'default'
