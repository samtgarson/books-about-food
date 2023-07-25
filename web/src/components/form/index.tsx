'use client'

import { Root } from '@radix-ui/react-form'
import { ComponentProps } from 'react'
import cn from 'classnames'

export type FormAction = (values: Record<string, unknown>) => Promise<void>
export type FormProps = Omit<ComponentProps<typeof Root>, 'action'> & {
  action?: FormAction
}

export function Form({ className, action, ...props }: FormProps) {
  return (
    <Root
      {...props}
      action={async (data) => {
        if (!action) return
        const values = Object.fromEntries(data.entries())
        await action(values)
      }}
      className={cn('flex flex-col w-full max-w-xl', className)}
    />
  )
}
