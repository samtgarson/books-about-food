import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from 'prisma/client'
import { getEnv } from 'src/utils/get-env'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline'
        }
      }
    })
  ]
}

export default NextAuth(authOptions)
