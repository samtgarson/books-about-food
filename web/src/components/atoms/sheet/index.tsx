'use client'

import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { X } from 'react-feather'
import { useSheet } from '../../sheets/global-sheet'
import { Loader } from '../loader'
import { SheetMap } from '../../sheets/types'

type SheetContext = {
  mobileOnly?: boolean
  close: () => void
  open: () => void
  onCancel?: () => void
}
const SheetContext = createContext<SheetContext>({} as SheetContext)
export const useSheetContext = () => useContext(SheetContext)

export const Trigger: FC<
  { className?: string; children: ReactNode } & Dialog.DialogTriggerProps
> = ({ className, children, ...props }) => {
  const { mobileOnly } = useSheetContext()
  return (
    <Dialog.Trigger
      className={cn(
        className,
        mobileOnly && 'pointer-events-auto sm:pointer-events-none'
      )}
      {...props}
    >
      {children}
    </Dialog.Trigger>
  )
}

export const Content = ({
  children,
  authenticated,
  size = 'md',
  loading
}: {
  children: ReactNode | (({ close }: { close: () => void }) => ReactNode)
  authenticated?: boolean | { action: keyof SheetMap }
  size?: 'md' | 'lg'
  loading?: boolean
}) => {
  const { onCancel, close } = useSheetContext()
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
      <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black bg-opacity-80" />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <Dialog.Content
          onEscapeKeyDown={() => onCancel?.()}
          onPointerDownOutside={() => onCancel?.()}
          onInteractOutside={() => onCancel?.()}
          className={cn(
            'animate-fade-in pointer-events-none flex w-full flex-shrink-0 flex-col',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg'
            }
          )}
          aria-describedby={undefined}
        >
          <Dialog.Close className="pointer-events-auto self-end p-4">
            <X strokeWidth={1} size={24} className="stroke-white" />
          </Dialog.Close>
          {content}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}

export const Body = ({
  className,
  loading,
  grey,
  children = null
}: {
  className?: string
  loading?: boolean
  grey?: boolean
  children?: ReactNode
}) => (
  <div
    className={cn(
      'book-shadow pointer-events-auto max-h-[80vh] overflow-auto p-5 sm:p-8',
      grey ? 'bg-grey' : 'bg-white',
      className
    )}
  >
    {loading ? <Loader /> : children}
  </div>
)

export const Header = ({
  children,
  title
}: {
  className?: string
  children?: ReactNode
  title: string
}) => (
  <div className="mb-4 flex justify-between sm:mb-6">
    <Dialog.Title>{title}</Dialog.Title>
    {children}
  </div>
)

export const Footer = ({ children }: { children: ReactNode }) => (
  <div className="bg-white">{children}</div>
)

export type SheetProps = {
  children: ReactNode
  mobileOnly?: boolean
  onCancel?: () => void
}

export const Root: FC<SheetProps> = ({ children, mobileOnly, onCancel }) => {
  const [open, setOpen] = useState(false)

  return (
    <SheetContext.Provider
      value={{
        mobileOnly,
        close: () => setOpen(false),
        open: () => setOpen(true),
        onCancel
      }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  )
}
