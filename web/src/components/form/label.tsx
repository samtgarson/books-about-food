'use client'

import * as Form from '@radix-ui/react-form'
import { ReactNode } from 'react'
import cn from 'classnames'

export function Label({
  children,
  required,
  className
}: {
  children: string | ReactNode
  required?: boolean
  className?: string
}) {
  const content =
    typeof children === 'string' ? <span>{children}</span> : children
  return (
    <Form.Label
      className={cn('flex justify-start items-center gap-2 text-14', className)}
    >
      {content}
      {required && (
        <span className="opacity-50 ml-auto">
          <span className="sr-only"> (</span>
          Required
          <span className="sr-only">)</span>
        </span>
      )}
    </Form.Label>
  )
}
