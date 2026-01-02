import { UserRole } from '@books-about-food/database'
import 'next-auth'
import { User as CoreUser } from 'src/core/types'

declare module '@auth/core/jwt' {
  interface JWT extends Omit<DefaultJWT, 'email'> {
    userId: string
    role: UserRole
    email: string
    publishers: string[]
  }
}

declare module 'next-auth' {
  interface Session {
    user: CoreUser
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends CoreUser {}
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
