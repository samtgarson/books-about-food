'use client'

import { usePathname } from 'next/navigation'
import { Dialog } from 'radix-ui'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { SheetContext, SheetScrollState } from './context'

export type SheetProps = {
  children: ReactNode
  mobileOnly?: boolean
  onClose?: () => void
  defaultOpen?: boolean
}

export type SheetControl = {
  setOpen(open: boolean | ((current: boolean) => boolean)): void
}

export const Root = forwardRef<SheetControl, SheetProps>(function Root(
  { children, mobileOnly, onClose, defaultOpen = false },
  ref
) {
  const pathname = usePathname()
  const [open, setOpen] = useState(defaultOpen)
  const [scrollState, setScrollState] = useState<SheetScrollState>({
    top: true,
    bottom: true
  })

  useImperativeHandle(
    ref,
    () => ({
      setOpen(val) {
        setOpen((current) => {
          const newVal = typeof val === 'function' ? val(current) : val
          if (!newVal) onClose?.()
          return newVal
        })
      }
    }),
    [setOpen, onClose]
  )

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <SheetContext.Provider
      value={{
        mobileOnly,
        close: () => {
          onClose?.()
          setOpen(false)
        },
        open: () => setOpen(true),
        scrollState,
        setScrollState
      }}
    >
      <Dialog.Root modal open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  )
})
