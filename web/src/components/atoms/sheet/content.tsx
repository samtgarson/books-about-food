import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { X } from 'src/components/atoms/icons'
import { useSheet } from 'src/components/sheets/global-sheet'
import type { SheetMap } from 'src/components/sheets/types'
import { Loader } from '../loader'
import { Body, SheetType } from './body'
import { Box } from './box'
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
  container?: HTMLElement
  type?: SheetType
}

export const Content = ({
  size = 'lg',
  overlay = true,
  focusTriggerOnClose = true,
  className,
  showCloseButton = true,
  container,
  type = 'dialog',
  ...props
}: SheetContentProps) => {
  const { close } = useSheetContext()

  return (
    <Dialog.Portal container={container}>
      <Dialog.Overlay
        className={cn(
          'animate-fade-in fixed inset-0 z-sheet',
          overlay && 'bg-black bg-opacity-80'
        )}
      />
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-sheet flex backdrop-filter',
          {
            'sm:pt-[15dvh] sm:short:pt-[5dvh] justify-center items-end sm:items-start':
              type === 'dialog',
            'justify-end items-stretch': type === 'drawer'
          }
        )}
      >
        <Dialog.Content
          onEscapeKeyDown={close}
          onPointerDownOutside={close}
          onInteractOutside={close}
          onCloseAutoFocus={(e) => {
            if (!focusTriggerOnClose) e.preventDefault()
          }}
          className={cn(
            'pointer-events-none flex w-full flex-shrink-0 flex-col relative focus:outline-none group',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg',
              'sm:max-w-[90vw]': size === 'xl',
              'max-h-[calc(100dvh)] sm:max-h-[75dvh] sm:short:max-h-[80dvh] animate-fade-slide-in sheet-dialog':
                type === 'dialog',
              'sheet-drawer px-3 pb-3 animate-drawer-enter': type === 'drawer'
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
          <AuthedContent overlay={overlay} {...props} />
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}

function AuthedContent({
  loading,
  children,
  authenticated,
  overlay
}: Pick<
  SheetContentProps,
  'loading' | 'children' | 'authenticated' | 'overlay'
>) {
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

  if ((!loading && !authenticated) || status === 'authenticated')
    return <Box overlay={overlay}>{nodes}</Box>
  if (status === 'loading' || loading)
    return (
      <Box overlay={overlay}>
        <Body>
          <Loader />
        </Body>
      </Box>
    )
  return null
}
