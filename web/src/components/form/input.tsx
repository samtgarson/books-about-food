'use client'

import cn from 'classnames'
import { forwardRef } from 'react'
import { FormStyleVariant, useForm } from './context'
import { Field } from './field'
import { InputProps, useRequired } from './input-props'

export const inputClasses = (
  variant: FormStyleVariant,
  props: Pick<InputProps<'input'>, 'disabled'>
) =>
  cn(
    'bg-white bg-opacity-60 p-4 transition-colors placeholder:text-black/20 focus-within:bg-opacity-100 focus-within:outline-hidden rounded-none',
    props.disabled && 'text-neutral-grey',
    variant === 'bordered' && 'border-neutral-grey border'
  )

export const Input = forwardRef<HTMLInputElement, InputProps<'input'>>(
  function Input(props, ref) {
    const { variant } = useForm()
    const required = useRequired(props.required)

    return (
      <Field<'input'> {...props}>
        <input
          {...props}
          required={required}
          ref={ref}
          className={inputClasses(variant, props)}
        />
      </Field>
    )
  }
)
