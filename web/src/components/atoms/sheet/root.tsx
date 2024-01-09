'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { usePathname } from 'next/navigation'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { SheetContext, SheetScrollState } from './context'

export type SheetProps = {
  children: ReactNode
  mobileOnly?: boolean
  grey?: boolean
  onClose?: () => void
  defaultOpen?: boolean
}

export type SheetControl = { setOpen: Dispatch<SetStateAction<boolean>> }

export const Root = forwardRef<SheetControl, SheetProps>(function Root(
  { children, mobileOnly, grey, onClose, defaultOpen = false },
  ref
) {
  const pathname = usePathname()
  const [open, setOpen] = useState(defaultOpen)
  const [scrollState, setScrollState] = useState<SheetScrollState>({
    top: true,
    bottom: true
  })

  useImperativeHandle(ref, () => ({ setOpen }), [setOpen])

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
        grey,
        scrollState,
        setScrollState
      }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  )
})
