'use client'

import * as Form from '@radix-ui/react-form'
import { Button, ButtonProps } from '../atoms/button'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

export function Submit(props: ButtonProps<'button'>) {
  const { pending } = useFormStatus()

  return (
    <Form.Submit asChild>
      <Button {...props} loading={!!pending} />
    </Form.Submit>
  )
}
