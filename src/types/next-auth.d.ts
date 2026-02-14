import 'next-auth'
import type { PayloadAuthjsUser } from 'payload-authjs'
import type { User as PayloadUser } from 'src/payload/payload-types'

declare module '@auth/core/jwt' {
  interface JWT extends Omit<DefaultJWT, 'email'> {
    id: string
    role: UserRole
    email: string
    publishers: string[]
    emailVerified: Date | null
  }
}

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends PayloadAuthjsUser<PayloadUser> {}
  interface Session {
    user: {
      id: string
      role: UserRole
      email: string
      picture: string | undefined
      publishers: string[]
      emailVerified: Date | null
    }
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
