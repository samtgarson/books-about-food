import cn from 'classnames'
import { Form } from 'radix-ui'
import type { JSX } from 'react'
import { useFormField } from './context'
import { InputProps, useRequired } from './input-props'
import { Label } from './label'
import { Messages } from './messages'

export function Field<T extends keyof JSX.IntrinsicElements>({
  label,
  name,
  children,
  className,
  ...props
}: Omit<InputProps<T>, 'children'> & { children: JSX.Element }) {
  const { error } = useFormField(name)
  const required = useRequired(props.required)

  return (
    <Form.Field
      name={name}
      className={cn(className, 'flex flex-col gap-2')}
      serverInvalid={!!error}
    >
      {label && <Label required={required}>{label}</Label>}
      <Form.Control asChild>{children}</Form.Control>
      {label && <Messages label={label} name={name} {...props} />}
    </Form.Field>
  )
}
