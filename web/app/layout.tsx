import { ReactNode } from 'react'
import { AuthProvider } from 'src/components/auth/auth-provider'
import 'src/utils/superjson'
import { fontClassname } from 'src/style/font'
import 'src/style/globals.css' // eslint-disable-line import/extensions
import { GlobalSheetProvider } from 'src/components/sheets/global-sheet'
import { Mouse } from 'src/components/atoms/mouse'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassname}>
      <head />
      <body className="min-h-screen flex flex-col relative">
        <AuthProvider>
          <GlobalSheetProvider>{children}</GlobalSheetProvider>
        </AuthProvider>
        <Mouse />
      </body>
    </html>
  )
}
