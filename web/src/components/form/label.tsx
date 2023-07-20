'use client'

import * as Form from '@radix-ui/react-form'

export function Label({
  children,
  required
}: {
  children: string
  required?: boolean
}) {
  return (
    <Form.Label className="flex justify-between text-14">
      <span>{children}</span>
      {required && (
        <span className="opacity-50">
          <span className="sr-only"> (</span>
          Required
          <span className="sr-only">)</span>
        </span>
      )}
    </Form.Label>
  )
}
