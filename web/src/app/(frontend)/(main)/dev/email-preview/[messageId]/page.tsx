'use client'
import { use, useEffect, useRef, useState } from 'react'
import { Container } from 'src/components/atoms/container'
import { Loader } from 'src/components/atoms/loader'
import { PageTitle } from 'src/components/atoms/page-title'
import { checkEmail } from './action'

export default function EmailPreviewPage({
  params
}: PageProps<'/dev/email-preview/[messageId]'>) {
  const messageId = use(params).messageId
  const [error, setError] = useState<string | null>(null)
  const count = useRef(0)

  useEffect(() => {
    if (error || !messageId) return

    const interval = setInterval(async function () {
      await checkEmail(messageId)
      if (count.current++ > 10) setError('Email not found')
    }, 1000)

    return () => clearInterval(interval)
  }, [messageId, error])

  return (
    <Container belowNav>
      <PageTitle>Email Preview</PageTitle>
      {error ? (
        <p>{error}</p>
      ) : (
        <p className="flex gap-2">
          <Loader /> Loading email with ID: <pre>{messageId}</pre>
        </p>
      )}
    </Container>
  )
}
