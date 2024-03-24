import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { Loader, X } from 'src/components/atoms/icons'
import { useSheet } from 'src/components/sheets/global-sheet'
import type { SheetMap } from 'src/components/sheets/types'
import { Body } from './body'
import { useSheetContext } from './context'

type SheetContentProps = {
  children: ReactNode | (({ close }: { close: () => void }) => ReactNode)
  authenticated?: boolean | { action: keyof SheetMap }
  size?: 'md' | 'lg' | 'xl'
  loading?: boolean
  overlay?: boolean
  focusTriggerOnClose?: boolean
  showCloseButton?: boolean
  className?: string
}

export const Content = ({
  size = 'lg',
  overlay = true,
  focusTriggerOnClose = true,
  className,
  showCloseButton = true,
  ...props
}: SheetContentProps) => {
  const { close } = useSheetContext()

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'animate-fade-in fixed inset-0 z-sheet',
          overlay && 'bg-black bg-opacity-80'
        )}
      />
      <div className="pointer-events-none fixed inset-0 z-sheet flex items-end justify-center sm:items-center backdrop-filter">
        <Dialog.Content
          onEscapeKeyDown={close}
          onPointerDownOutside={close}
          onInteractOutside={close}
          onCloseAutoFocus={(e) => {
            if (!focusTriggerOnClose) e.preventDefault()
          }}
          className={cn(
            'animate-fade-in pointer-events-none flex w-full flex-shrink-0 flex-col relative book-shadow max-h-[calc(100dvh)] sm:max-h-[80dvh] focus:outline-none',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg',
              'sm:max-w-[90vw]': size === 'xl'
            },
            className
          )}
          aria-describedby={undefined}
          data-sheet-portal
        >
          {showCloseButton && (
            <Dialog.Close className="pointer-events-auto p-4 self-end">
              <X strokeWidth={1} size={24} className="stroke-white" />
            </Dialog.Close>
          )}
          <AuthedContent {...props} />
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}

function AuthedContent({
  loading,
  children,
  authenticated
}: Pick<SheetContentProps, 'loading' | 'children' | 'authenticated'>) {
  const { status } = useSession()
  const { close } = useSheetContext()
  const { openSheet } = useSheet()

  const nodes = useMemo(
    () => (children instanceof Function ? children({ close }) : children),
    [children, close]
  )

  useEffect(() => {
    if (!authenticated || status !== 'unauthenticated') return
    let redirect = location.pathname
    if (typeof authenticated !== 'boolean' && authenticated.action)
      redirect += `?action=${authenticated.action}`

    close()
    openSheet('signIn', { redirect })
  }, [authenticated, openSheet, status, close])

  if ((!loading && !authenticated) || status === 'authenticated') return nodes
  if (status === 'loading' || loading)
    return (
      <Body>
        <Loader />
      </Body>
    )
  return null
}
