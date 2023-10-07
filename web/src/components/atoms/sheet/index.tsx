'use client'

import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import {
  createContext,
  Dispatch,
  FC,
  forwardRef,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { X } from 'react-feather'
import { useSheet } from '../../sheets/global-sheet'
import { SheetMap } from '../../sheets/types'
import { Loader } from '../loader'

type SheetContext = {
  mobileOnly?: boolean
  close: () => void
  open: () => void
  grey?: boolean
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
  loading,
  overlay = true,
  focusTriggerOnClose = true
}: {
  children: ReactNode | (({ close }: { close: () => void }) => ReactNode)
  authenticated?: boolean | { action: keyof SheetMap }
  size?: 'md' | 'lg'
  loading?: boolean
  overlay?: boolean
  focusTriggerOnClose?: boolean
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
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            if (!focusTriggerOnClose) e.preventDefault()
          }}
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
  children = null
}: {
  className?: string
  loading?: boolean
  children?: ReactNode
}) => {
  const { grey } = useSheetContext()
  return (
    <div
      className={cn(
        'book-shadow pointer-events-auto max-h-[80vh] overflow-auto p-5 sm:p-8 isolate',
        grey ? 'bg-grey' : 'bg-white',
        className
      )}
    >
      {loading ? <Loader /> : children}
    </div>
  )
}

export const Header = ({
  children,
  title,
  size = 'lg'
}: {
  className?: string
  children?: ReactNode
  title: string
  size?: 'lg' | 'sm'
}) => {
  const { grey } = useSheetContext()
  return (
    <div
      className={cn(
        ' flex justify-between py-5 sm:py-8 sticky -top-5 -mt-5 sm:-top-8 sm:-mt-8 z-30',
        size == 'lg' && 'text-24',
        grey ? 'bg-grey' : 'bg-white'
      )}
    >
      <Dialog.Title>{title}</Dialog.Title>
      {children}
    </div>
  )
}

export const Footer = ({ children }: { children: ReactNode }) => (
  <div className="bg-white">{children}</div>
)

export type SheetProps = {
  children: ReactNode
  mobileOnly?: boolean
  grey?: boolean
  onClose?: () => void
}

export type SheetControl = { setOpen: Dispatch<SetStateAction<boolean>> }

export const Root = forwardRef<SheetControl, SheetProps>(function Root(
  { children, mobileOnly, grey, onClose },
  ref
) {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({ setOpen }), [setOpen])

  return (
    <SheetContext.Provider
      value={{
        mobileOnly,
        close: () => {
          onClose?.()
          setOpen(false)
        },
        open: () => setOpen(true),
        grey
      }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  )
})
