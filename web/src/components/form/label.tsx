'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { ReactNode } from 'react'

export function Label({
  children,
  required,
  className
}: {
  children?: ReactNode
  required?: boolean
  className?: string
}) {
  const content =
    typeof children === 'string' ? <span>{children}</span> : children
  return (
    <Form.Label
      className={cn('text-14 flex items-center justify-start gap-2', className)}
    >
      {content}
      {required && (
        <span className="ml-auto opacity-50">
          <span className="sr-only"> (</span>
          Required
          <span className="sr-only">)</span>
        </span>
      )}
    </Form.Label>
  )
}
