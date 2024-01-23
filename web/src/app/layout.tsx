import { SpeedInsights } from '@vercel/speed-insights/next'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { Mouse } from 'src/components/atoms/mouse'
import { AuthProvider } from 'src/components/auth/auth-provider'
import { GlobalSheetProvider } from 'src/components/sheets/global-sheet'
import { Fathom } from 'src/components/utils/fathom'
import { fontClassname } from 'src/style/font'
import 'src/style/globals.css'
import 'src/utils/superjson'

export * from './metadata'

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={fontClassname}>
      <body className="relative flex min-h-screen flex-col transition-colors duration-700">
        <Fathom />
        <AuthProvider>
          <GlobalSheetProvider>
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: 4,
                  paddingBlock: 16,
                  paddingInline: 20,
                  boxShadow:
                    '0px 3.15564px 2.52452px 0px rgba(0, 0, 0, 0.02), 0px 7.58345px 6.06676px 0px rgba(0, 0, 0, 0.03)',
                  fontSize: 16,
                  gap: 16
                },
                className: 'font-sans'
              }}
            />
            {children}
          </GlobalSheetProvider>
        </AuthProvider>
        <Mouse />
        <SpeedInsights />
      </body>
    </html>
  )
}
