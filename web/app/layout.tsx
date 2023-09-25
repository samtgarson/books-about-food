import { Metadata } from 'next'
import { ReactNode } from 'react'
import { Mouse } from 'src/components/atoms/mouse'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { GlobalSheetProvider } from 'src/components/sheets/global-sheet'
import { fontClassname } from 'src/style/font'
import 'src/style/globals.css' // eslint-disable-line import/extensions
import 'src/utils/superjson'

export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  title: {
    template: '%s | Books About Food',
    absolute: 'Books About Food'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassname}>
      <body className="relative flex min-h-screen flex-col">
        <AuthProvider>
          <GlobalSheetProvider>{children}</GlobalSheetProvider>
        </AuthProvider>
        <Mouse />
      </body>
    </html>
  )
}
