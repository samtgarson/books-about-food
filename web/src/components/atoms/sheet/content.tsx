import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { Loader, X } from 'react-feather'
import { useSheet } from 'src/components/sheets/global-sheet'
import { SheetMap } from 'src/components/sheets/types'
import { Body } from './body'
import { useSheetContext } from './context'

export const Content = ({
  children,
  authenticated,
  size = 'lg',
  loading,
  overlay = true,
  focusTriggerOnClose = true,
  className
}: {
  children: ReactNode | (({ close }: { close: () => void }) => ReactNode)
  authenticated?: boolean | { action: keyof SheetMap }
  size?: 'md' | 'lg' | 'xl'
  loading?: boolean
  overlay?: boolean
  focusTriggerOnClose?: boolean
  className?: string
}) => {
  const { close } = useSheetContext()
  const { openSheet } = useSheet()
  const { status } = useSession()

  const nodes = useMemo(
    () => (children instanceof Function ? children({ close }) : children),
    [children, close]
  )

  const content = useMemo(() => {
    if ((!loading && !authenticated) || status === 'authenticated') return nodes
    if (status === 'loading' || loading)
      return (
        <Body>
          <Loader />
        </Body>
      )
    return null
  }, [authenticated, nodes, status, loading])

  useEffect(() => {
    if (!authenticated || status !== 'unauthenticated') return
    let redirect = location.pathname
    if (typeof authenticated !== 'boolean' && authenticated.action)
      redirect += `?action=${authenticated.action}`

    openSheet('signIn', { redirect })
  }, [authenticated, openSheet, status, close])

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'animate-fade-in fixed inset-0 z-50',
          overlay && 'bg-black bg-opacity-80'
        )}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center backdrop-filter">
        <Dialog.Content
          onEscapeKeyDown={close}
          onPointerDownOutside={close}
          onInteractOutside={close}
          onCloseAutoFocus={(e) => {
            if (!focusTriggerOnClose) e.preventDefault()
          }}
          className={cn(
            'animate-fade-in pointer-events-none flex w-full flex-shrink-0 flex-col relative book-shadow',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg',
              'sm:max-w-[90vw]': size === 'xl'
            },
            className
          )}
          aria-describedby={undefined}
        >
          <Dialog.Close className="pointer-events-auto absolute p-4 right-0 -top-14">
            <X strokeWidth={1} size={24} className="stroke-white" />
          </Dialog.Close>
          {content}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}