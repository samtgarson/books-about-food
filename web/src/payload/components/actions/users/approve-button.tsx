'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { approveUser } from '../../../actions/users'
import { ActionButton } from '../action-button'

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
