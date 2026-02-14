'use client'

import type { DefaultCellComponentProps } from 'payload'
import { ActionCell } from '../../../components/actions/action-cell'
import { approveClaim } from '../actions'

export function ClaimApproveCell({ rowData }: DefaultCellComponentProps) {
  const id = rowData?.id as string | undefined
  const state = rowData?.state as string | undefined

  // Only show approve button for pending claims
  if (state !== 'pending' || !id) {
    return null
  }

  return (
    <ActionCell
      action={() => approveClaim(id)}
      label="Approve"
      confirmTitle="Approve Claim"
      confirmMessage="This will link the profile to the user account."
      successMessage="Claim approved"
    />
  )
}
