'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { fontClassname } from 'src/style/font'
import Error from './error'

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en" className={fontClassname}>
      <body className="relative flex min-h-screen flex-col">
        <Error error={error} />
      </body>
    </html>
  )
}
