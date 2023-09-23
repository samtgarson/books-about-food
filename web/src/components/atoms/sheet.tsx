'use client'

import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { useSheet } from '../sheets/global-sheet'
import { Loader } from './loader'

type SheetContext = {
  mobileOnly?: boolean
  close: () => void
  open: () => void
  onCancel?: () => void
  isOpen: boolean
  action?: string
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
  authenticated?: boolean
  size?: 'md' | 'lg'
  loading?: boolean
}) => {
  const { onCancel, close, isOpen, action } = useSheetContext()
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
    if (!isOpen || !authenticated || status !== 'unauthenticated') return
    let redirect = location.pathname
    if (action) redirect += `?action=${action}`

    openSheet('signIn', { redirect })
    close()
  }, [authenticated, openSheet, status, isOpen, close, action])

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed z-50 inset-0 bg-black bg-opacity-80 animate-fade-in" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 pointer-events-none">
        <Dialog.Content
          onEscapeKeyDown={() => onCancel?.()}
          onPointerDownOutside={() => onCancel?.()}
          onInteractOutside={() => onCancel?.()}
          className={cn(
            'animate-fade-in flex-shrink-0 flex flex-col w-full pointer-events-none',
            {
              'sm:max-w-lg': size === 'md',
              'sm:max-w-xl': size === 'lg'
            }
          )}
          aria-describedby={undefined}
        >
          <Dialog.Close className="p-4 self-end pointer-events-auto">
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
      'book-shadow p-5 sm:p-8 max-h-[80vh] overflow-auto pointer-events-auto',
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
  <div className="flex justify-between mb-4 sm:mb-6">
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
  action?: string
}

export const Root: FC<SheetProps> = ({
  children,
  mobileOnly,
  onCancel,
  action
}) => {
  const search = new URLSearchParams(global.location?.search)
  const router = useRouter()
  const [open, setOpen] = useState(
    action && search?.get('action') === action ? true : false
  )

  useEffect(() => {
    if (action && search?.get('action') === action)
      router.replace(location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, router])

  return (
    <SheetContext.Provider
      value={{
        mobileOnly,
        close: () => setOpen(false),
        open: () => setOpen(true),
        onCancel,
        isOpen: open,
        action
      }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  )
}
