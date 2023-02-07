'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import 'src/utils/superjson'

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
)
