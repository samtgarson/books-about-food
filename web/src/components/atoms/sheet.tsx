'use client'

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import cn from 'classnames'
import * as Dialog from '@radix-ui/react-dialog'
import { Loader, X } from 'react-feather'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSheet } from '../sheets/global-sheet'

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
  authenticated
}: {
  children: ReactNode
  authenticated?: boolean
}) => {
  const { onCancel } = useSheetContext()
  const { openSheet } = useSheet()
  const { status } = useSession()

  const content = useMemo(() => {
    if (!authenticated || status === 'authenticated') return children
    if (status === 'loading')
      return (
        <Body>
          <Loader />
        </Body>
      )
    openSheet('signIn')
    return null
  }, [authenticated, children, openSheet, status])

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed z-50 inset-0 bg-black bg-opacity-80 animate-fade-in" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 pointer-events-none">
        <Dialog.Content
          onEscapeKeyDown={() => onCancel?.()}
          onPointerDownOutside={() => onCancel?.()}
          onInteractOutside={() => onCancel?.()}
          className="animate-fade-in sm:max-w-lg flex-shrink-0 flex flex-col w-full pointer-events-none"
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
  children
}: {
  className?: string
  loading?: boolean
  grey?: boolean
  children: ReactNode
}) => (
  <div
    className={cn(
      'book-shadow p-5 sm:p-8 max-h-[70vh] overflow-auto pointer-events-auto',
      grey ? 'bg-grey' : 'bg-white',
      className
    )}
  >
    {loading ? (
      <Loader strokeWidth={1} className="animate-spin text-32 mx-auto my-8" />
    ) : (
      children
    )}
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
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    if (action && search.get('action') === action) {
      if (!open) setOpen(true)
      router.replace(location.pathname)
    }
  }, [action, open, router])

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
