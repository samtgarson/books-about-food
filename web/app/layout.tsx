import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'

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
