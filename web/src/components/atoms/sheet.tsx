'use client'

import { createContext, FC, ReactNode, useContext, useState } from 'react'
import cn from 'classnames'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'react-feather'

export type SheetProps = {
  children: ReactNode
  mobileOnly?: boolean
  onCancel?: () => void
}

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

export const Content = ({ children }: { children: ReactNode }) => {
  const { onCancel } = useSheetContext()
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed z-50 inset-0 bg-black bg-opacity-80 animate-fade-in" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 pointer-events-none">
        <Dialog.Content
          onEscapeKeyDown={() => onCancel?.()}
          onPointerDownOutside={() => onCancel?.()}
          onInteractOutside={() => onCancel?.()}
          className="animate-fade-slide-in sm:max-w-lg flex-shrink-0 flex flex-col w-full"
          aria-describedby={undefined}
        >
          <Dialog.Close className="p-4 self-end">
            <X strokeWidth={1} size={24} className="stroke-white" />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}

export const Body = ({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) => (
  <div
    className={cn(
      'book-shadow bg-white p-5 sm:p-8 max-h-[70vh] overflow-auto',
      className
    )}
  >
    {children}
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
