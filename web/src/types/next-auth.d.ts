import { UserRole } from '@books-about-food/database'

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    userId: string
    role: UserRole
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole
    } & User
  }

  interface User {
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
