import { appUrl } from 'core/utils/app-url'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
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
    default: 'Books About Food'
  },
  metadataBase: new URL(appUrl)
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassname}>
      <body className="relative flex min-h-screen flex-col">
        <AuthProvider>
          <GlobalSheetProvider>
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: 4,
                  paddingBlock: 16,
                  paddingInline: 20,
                  boxShadow:
                    '0px 3.15564px 2.52452px 0px rgba(0, 0, 0, 0.02), 0px 7.58345px 6.06676px 0px rgba(0, 0, 0, 0.03)'
                },
                className: 'font-sans text-16'
              }}
            />
            {children}
          </GlobalSheetProvider>
        </AuthProvider>
        <Mouse />
      </body>
    </html>
  )
}
