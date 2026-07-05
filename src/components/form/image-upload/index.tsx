'use client'

import cn from 'classnames'
import { Form } from 'radix-ui'
import { useRef, useState } from 'react'
import { containerClasses } from 'src/components/atoms/container'
import { Image } from 'src/core/models/image'
import { useFormField } from '../context'
import { InputProps, useRequired } from '../input-props'
import { Label } from '../label'
import { Messages } from '../messages'
import { ImageUploadCore } from './core'

export type ImageUploadProps<Multi extends boolean> = {
  defaultValue?: Multi extends true ? Array<Image> : Image
  multi?: Multi
  prefix: string
  onReorderImages?: (ids: string[]) => Promise<void>
} & Omit<InputProps<'input'>, 'multiple' | 'value' | 'defaultValue'>

export function ImageUpload<Multi extends boolean = false>({
  label,
  name,
  multi,
  defaultValue,
  prefix,
  className,
  onReorderImages,
  ...props
}: ImageUploadProps<Multi>) {
  const input = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<Image[]>(
    Array.isArray(defaultValue)
      ? defaultValue
      : !defaultValue
        ? []
        : [defaultValue]
  )
  const required = useRequired(props.required)
  const { setError } = useFormField(name)

  function notifyChange() {
    setTimeout(() => {
      input.current?.dispatchEvent(new Event('change', { bubbles: true }))
    }, 10)
  }

  return (
    <Form.Field name={name} className={cn('flex flex-col gap-2', className)}>
      <Label required={required}>{label}</Label>
      <Form.Control asChild>
        <input
          name={name}
          {...props}
          required={required}
          type="text"
          className="h-0 opacity-0"
          ref={input}
          value={images.map((i) => i.id).join(',')}
        />
      </Form.Control>
      <ImageUploadCore
        images={images}
        multi={multi}
        prefix={prefix}
        className={cn(
          'bg-sand',
          containerClasses(),
          containerClasses({ scroll: true })
        )}
        onReorder={async (reordered) => {
          setImages(reordered)
          await onReorderImages?.(reordered.map((i) => i.id))
        }}
        onDelete={(image) => {
          setImages((existing) => existing.filter((i) => i.id !== image.id))
        }}
        onUpload={(uploaded) => {
          setImages((existing) => [...existing, ...uploaded])
          notifyChange()
        }}
        onError={(message) => setError({ message })}
      />
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
