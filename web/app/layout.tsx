import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { TopNav } from 'src/components/nav/top-nav'
import 'src/utils/superjson'
import { graphik } from 'src/style/font'
import 'src/style/globals.css' // eslint-disable-line import/extensions
import { Container } from 'src/components/atoms/container'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={graphik.variable}>
      <head />
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <TopNav />
          <main className="flex-grow">{children}</main>
          <footer>
            <Container className="mt-20 py-12 bg-white h-40">Footer</Container>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
