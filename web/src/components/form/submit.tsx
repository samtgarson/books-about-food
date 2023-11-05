'use client'

import * as Form from '@radix-ui/react-form'
import { Button, ButtonProps } from '../atoms/button'
import { useForm } from './context'

export function Submit(props: ButtonProps<'button'>) {
  const { loading } = useForm()

  return (
    <Form.Submit asChild>
      <Button {...props} loading={loading} />
    </Form.Submit>
  )
}
