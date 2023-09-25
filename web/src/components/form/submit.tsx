'use client'

import * as Form from '@radix-ui/react-form'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '../atoms/button'

export function Submit(props: ButtonProps<'button'>) {
  const { pending } = useFormStatus()

  return (
    <Form.Submit asChild>
      <Button {...props} loading={!!pending} />
    </Form.Submit>
  )
}
