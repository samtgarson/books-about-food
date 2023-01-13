import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { TopNav } from 'src/components/nav/top-nav'
import 'src/utils/superjson'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>
        <AuthProvider>
          <TopNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
