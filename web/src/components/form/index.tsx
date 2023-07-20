'use client'

import { Root } from '@radix-ui/react-form'
import { ComponentProps } from 'react'

export type FormProps = ComponentProps<typeof Root>

export function Form(props: FormProps) {
  return <Root {...props} className="flex flex-col w-full max-w-xl" />
}
