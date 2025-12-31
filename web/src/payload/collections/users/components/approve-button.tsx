'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { ActionButton } from '../../../components/actions/action-button'
import { approveUser } from '../actions'

export function UserApproveButton() {
  const { id, initialData } = useDocumentInfo()

  // Only show for waitlist users
  const role = initialData?.role as string | undefined
  if (role !== 'waitlist' || !id) {
    return null
  }

  return (
    <ActionButton
      action={() => approveUser(String(id))}
      label="Approve"
      confirmTitle="Approve User"
      confirmMessage="This user will be moved off the waitlist."
      successMessage="User approved"
      variant="primary"
    />
  )
}
