'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { ActionButton } from '../../../components/actions/action-button'
import { approveClaim } from '../actions'

export function ClaimApproveButton() {
  const { id, initialData } = useDocumentInfo()

  const state = initialData?.state as string | undefined
  if (state !== 'pending' || !id) {
    return null
  }

  return (
    <ActionButton
      action={() => approveClaim(String(id))}
      label="Approve"
      confirmTitle="Approve Claim"
      confirmMessage="This will link the profile to the user account."
      successMessage="Claim approved"
      variant="primary"
    />
  )
}
