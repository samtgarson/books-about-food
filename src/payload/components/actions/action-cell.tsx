'use client'

import { ConfirmationModal, useModal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useId, useState } from 'react'
import { toast } from 'sonner'
import type { ActionResult } from './action-button'

type ActionCellProps = {
  action: () => Promise<ActionResult>
  label: string
  confirmMessage?: string
  confirmTitle?: string
  successMessage?: string
  disabled?: boolean
}

export function ActionCell({
  action,
  label,
  confirmMessage,
  confirmTitle = 'Confirm',
  successMessage,
  disabled = false
}: ActionCellProps) {
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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (confirmMessage) {
        openModal(modalSlug)
      } else {
        executeAction()
      }
    },
    [confirmMessage, openModal, modalSlug, executeAction]
  )

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: 500,
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-200)',
          backgroundColor: 'var(--theme-elevation-50)',
          color: 'var(--theme-elevation-800)',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled || loading ? 0.5 : 1
        }}
      >
        {loading ? '...' : label}
      </button>
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
