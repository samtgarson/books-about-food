import { appUrl } from '@books-about-food/shared/utils/app-url'
import * as Sentry from '@sentry/nextjs'
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

export { metadata, viewport } from './metadata'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Books About Food',
  alternateName: 'BAF',
  url: appUrl()
}

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={fontClassname}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            // defines globalThis in environments where it's not
            __html: `!function(t){function e(){var e=this||self;e.globalThis=e,delete t.prototype._T_}"object"!=typeof globalThis&&(this?e():(t.defineProperty(t.prototype,"_T_",{configurable:!0,get:e}),_T_))}(Object);`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative flex min-h-screen flex-col transition-colors duration-700">
        <Sentry.ErrorBoundary fallback={<div>FOO</div>}>
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
        </Sentry.ErrorBoundary>
      </body>
    </html>
  )
}
