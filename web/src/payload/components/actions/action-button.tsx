'use client'

import { Button, ConfirmationModal, useModal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useId, useState } from 'react'
import { toast } from 'sonner'

export type ActionResult = {
  success: boolean
  error?: string
  message?: string
}

type ActionButtonProps = {
  action: () => Promise<ActionResult>
  label: string
  confirmMessage?: string
  confirmTitle?: string
  successMessage?: string
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

export function ActionButton({
  action,
  label,
  confirmMessage,
  confirmTitle = 'Confirm',
  successMessage,
  variant = 'secondary',
  size = 'medium',
  disabled = false
}: ActionButtonProps) {
  const router = useRouter()
  const { openModal } = useModal()
  const modalSlug = useId()
  const [loading, setLoading] = useState(false)

  const executeAction = useCallback(async () => {
    setLoading(true)
    try {
      const result = await action()
      if (result.success) {
        toast.success(result.message ?? successMessage ?? 'Action completed')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Action failed')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }, [action, successMessage, router])

  const handleClick = useCallback(() => {
    if (confirmMessage) {
      openModal(modalSlug)
    } else {
      executeAction()
    }
  }, [confirmMessage, openModal, modalSlug, executeAction])

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || loading}
        buttonStyle={variant}
        size={size}
      >
        {loading ? 'Loading...' : label}
      </Button>
      {confirmMessage && (
        <ConfirmationModal
          modalSlug={modalSlug}
          heading={confirmTitle}
          body={confirmMessage}
          confirmLabel={label}
          cancelLabel="Cancel"
          onConfirm={executeAction}
        />
      )}
    </>
  )
}
