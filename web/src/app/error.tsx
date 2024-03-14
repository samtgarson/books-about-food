'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from 'src/components/atoms/button'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { LogoShape } from 'src/components/icons/logo-shape'

export default function Error({
  error,
  reset
}: {
  error?: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    if (!error) return
    Sentry.captureException(error)
  }, [error])

  return (
    <Container belowNav>
      <LogoShape text className="w-16 h-auto" />
      <PageTitle className="!pb-8">Something went wrong</PageTitle>
      <p className="mb-4">
        Apologies for any inconvenience, our team is has already been notified.
      </p>
      <div className="flex gap-4">
        {reset && <Button onClick={() => reset()}>Try again</Button>}
        <Button variant="secondary" href="/">
          Go Home
        </Button>
      </div>
    </Container>
  )
}
