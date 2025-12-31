'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { publishBook } from '../../../actions/books'
import { ActionButton } from '../action-button'

export function BookPublishButton() {
  const { id, initialData } = useDocumentInfo()

  // Only show for non-published books
  const status = initialData?.status as string | undefined
  if (status === 'published' || !id) {
    return null
  }

  return (
    <ActionButton
      action={() => publishBook(String(id))}
      label="Publish"
      confirmTitle="Publish Book"
      confirmMessage="This book will become visible on the site."
      successMessage="Book published"
      variant="primary"
    />
  )
}
