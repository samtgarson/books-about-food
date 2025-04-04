'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from 'src/components/atoms/button'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { useNav } from 'src/components/nav/context'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { setTheme } = useNav()
  useEffect(() => {
    Sentry.captureException(error)
    setTheme('dark')
  }, [error, setTheme])

  return (
    <Container belowNav>
      <PageTitle className="!pb-8">Something went wrong</PageTitle>
      <p className="mb-4">
        Apologies for any inconvenience, our team has already been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="secondary" href="/">
          Go Home
        </Button>
      </div>
    </Container>
  )
}
