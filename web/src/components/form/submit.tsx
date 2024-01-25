'use client'

import * as Form from '@radix-ui/react-form'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '../atoms/button'
import { useForm } from './context'

export function Submit({ variant = 'dark', ...props }: ButtonProps) {
  const { pending } = useFormStatus()
  const { errors } = useForm()

  return (
    <>
      {errors && '_' in errors && (
        <p className="text-primary-red" aria-live="assertive">
          {errors._.message}
        </p>
      )}
      <Form.Submit asChild>
        <Button {...props} loading={pending} variant={variant} />
      </Form.Submit>
    </>
  )
}
