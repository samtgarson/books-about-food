'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import 'src/utils/superjson'

export const AuthProvider = ({
  children,
  session
}: {
  children: ReactNode
  session?: Session | null
}) => (
  <SessionProvider refetchOnWindowFocus session={session}>
    {children}
  </SessionProvider>
)
