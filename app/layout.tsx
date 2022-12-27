import { AuthProvider } from '@/components/auth/auth-provider'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
