import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { Dialog } from 'radix-ui'
import { CSSProperties, ReactNode, useEffect, useMemo } from 'react'
import { X } from 'src/components/atoms/icons'
import { useSheet } from 'src/components/sheets/global-sheet'
import type { SheetMap } from 'src/components/sheets/types'
import { useVisualViewport } from 'src/hooks/use-visual-viewport'
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
  wide?: boolean
} & ControlsBarProps

export function Content({
  size = 'lg',
  overlay = true,
  focusTriggerOnClose = true,
  className,
  showCloseButton = true,
  container,
  type = 'dialog',
  wide = false,
  ...props
}: SheetContentProps) {
  const { close } = useSheetContext()
  const viewport = useVisualViewport()

  return (
    <Dialog.Portal container={container}>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-sheet animate-fade-in',
          overlay && 'bg-black bg-opacity-80'
        )}
      />
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-sheet flex backdrop-filter',
          {
            'items-end justify-center sm:items-start sm:pt-[15dvh] sm:short:pt-[5dvh]':
              type === 'dialog',
            'items-stretch justify-end': type === 'drawer'
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
            'focus:outline-hidden group pointer-events-none relative flex w-full flex-1 shrink-0 flex-col justify-center gap-3 sm:gap-4',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg',
              'sm:max-w-[90vw]': size === 'xl',
              'sheet-dialog max-h-[min(var(--max-height),100dvh)] animate-fade-slide-in sm:max-h-[min(var(--max-height),75dvh)] sm:short:max-h-[min(var(--max-height),80dvh)]':
                type === 'dialog',
              'sheet-drawer m-3 animate-drawer-enter rounded-lg p-3':
                type === 'drawer'
            },
            overlay && 'bg-white sm:p-8',
            wide ? 'py-5' : 'p-5',
            className
          )}
          aria-describedby={undefined}
          style={{ '--max-height': `${viewport.height}px` } as CSSProperties}
          data-sheet-anchor
        >
          {showCloseButton && <ControlsBar {...props} wide={wide} />}
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

type ControlsBarProps =
  | { hideTitle?: never; title: string; controls?: ReactNode }
  | { hideTitle: true; title?: never; controls?: never }

function ControlsBar({
  title,
  controls,
  wide,
  className
}: ControlsBarProps & { wide?: boolean; className?: string }) {
  const { scrollState } = useSheetContext()

  return (
    <div
      className={cn(
        'z-30 -mb-3 flex items-center justify-end gap-4 border-b pb-3 transition-colors sm:-mb-4 sm:pb-4',
        '-mx-5 sm:-mx-8 sm:px-8',
        !scrollState.top ? 'border-neutral-grey' : 'border-transparent',
        wide ? 'px-10' : 'px-5',
        className
      )}
    >
      {title && <Title className="mr-auto grow">{title}</Title>}
      {controls}
      <Dialog.Close className="pointer-events-auto">
        <X strokeWidth={1} size={24} />
      </Dialog.Close>
    </div>
  )
}
