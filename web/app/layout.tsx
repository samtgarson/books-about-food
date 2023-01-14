import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { TopNav } from 'src/components/nav/top-nav'
import 'src/utils/superjson'
import { graphik } from 'src/style/font'
import 'src/style/globals.css' // eslint-disable-line import/extensions

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={graphik.variable}>
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
