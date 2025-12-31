'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { cancelClaim } from '../../../actions/claims'
import { ActionButton } from '../action-button'

export function ClaimCancelButton() {
  const { id, initialData } = useDocumentInfo()

  const state = initialData?.state as string | undefined
  if (state !== 'pending' || !id) {
    return null
  }

  return (
    <ActionButton
      action={() => cancelClaim(String(id))}
      label="Cancel"
      confirmTitle="Cancel Claim"
      confirmMessage="This claim will be rejected."
      successMessage="Claim cancelled"
      variant="secondary"
    />
  )
}
