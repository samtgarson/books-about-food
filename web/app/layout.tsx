import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { TopNav } from 'src/components/nav/top-nav'
import 'src/utils/superjson'
import { fontClassname } from 'src/style/font'
import 'src/style/globals.css' // eslint-disable-line import/extensions
import { Footer } from 'src/components/nav/footer'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassname}>
      <head />
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <TopNav />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
