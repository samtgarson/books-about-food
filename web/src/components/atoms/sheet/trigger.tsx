import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { FC, ReactNode } from 'react'
import { useSheetContext } from './context'

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
