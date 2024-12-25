import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { X } from 'src/components/atoms/icons'
import { useSheet } from 'src/components/sheets/global-sheet'
import type { SheetMap } from 'src/components/sheets/types'
import { Loader } from '../loader'
import { Body, SheetType, Title } from './body'
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
} & ControlsBarProps

export function Content({
  size = 'lg',
  overlay = true,
  focusTriggerOnClose = true,
  className,
  showCloseButton = true,
  container,
  type = 'dialog',
  ...props
}: SheetContentProps) {
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
            'pointer-events-none flex w-full flex-shrink-0 flex-col relative focus:outline-none group overflow-y-auto',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg',
              'sm:max-w-[90vw]': size === 'xl',
              'max-h-[calc(100dvh)] sm:max-h-[75dvh] sm:short:max-h-[80dvh] animate-fade-slide-in sheet-dialog':
                type === 'dialog',
              'sheet-drawer p-3 animate-drawer-enter rounded-lg m-3':
                type === 'drawer'
            },
            overlay && 'bg-white p-5 sm:p-8',
            className
          )}
          aria-describedby={undefined}
          data-sheet-portal
        >
          {showCloseButton && <ControlsBar {...props} />}
          <div className="flex flex-col justify-center gap-3 sm:gap-4 flex-1">
            <AuthedContent {...props} />
          </div>
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

type ControlsBarProps =
  | { hideTitle?: never; title: string; controls?: ReactNode }
  | { hideTitle: true; title?: never; controls?: never }

function ControlsBar({ title, controls }: ControlsBarProps) {
  const { scrollState } = useSheetContext()

  return (
    <div
      className={cn(
        'flex gap-4 justify-end z-30 border-b transition-colors pb-3 sm:pb-4 items-center',
        !scrollState.top ? 'border-neutral-grey' : 'border-transparent'
      )}
    >
      {title && <Title className="flex-grow mr-auto">{title}</Title>}
      {controls}
      <Dialog.Close className="pointer-events-auto">
        <X strokeWidth={1} size={24} />
      </Dialog.Close>
    </div>
  )
}
