'use client'

import { Image } from '@books-about-food/core/models/image'
import cn from 'classnames'
import { Reorder } from 'framer-motion'
import Img from 'next/image'
import { Form } from 'radix-ui'
import { useRef, useState } from 'react'
import { containerClasses } from 'src/components/atoms/container'
import { Plus, X } from 'src/components/atoms/icons'
import { mouseAttrs } from 'src/components/atoms/mouse'
import { InputProps, useRequired } from '../input-props'
import { Label } from '../label'
import { Messages } from '../messages'
import { reorderImages } from './action'
import { ImageUploadButton } from './upload-button'

export type ImageUploadProps<Multi extends boolean> = {
  defaultValue?: Multi extends true ? Array<Image> : Image
  multi?: Multi
  prefix: string
} & Omit<InputProps<'input'>, 'multiple' | 'value' | 'defaultValue'>

export function ImageUpload<Multi extends boolean = false>({
  label,
  name,
  multi,
  defaultValue,
  prefix,
  className,
  ...props
}: ImageUploadProps<Multi>) {
  const input = useRef<HTMLInputElement>(null)
  const uploadButton = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<Image[]>(
    Array.isArray(defaultValue)
      ? defaultValue
      : !defaultValue
        ? []
        : [defaultValue]
  )
  const required = useRequired(props.required)

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
      <Reorder.Group
        axis="x"
        values={images}
        onReorder={async function (images) {
          setImages(images)
          await reorderImages(images.map((i) => i.id))
        }}
        layoutScroll
        className={cn(
          'bg-sand w-full gap-6 py-12 flex overflow-auto',
          !images.length && 'cursor-pointer',
          containerClasses(),
          containerClasses({ scroll: true })
        )}
      >
        {images.map((image) => (
          <Reorder.Item
            key={image.id}
            value={image}
            className={cn(
              'relative shrink-0',
              images.length === 1 && !multi && 'mx-auto',
              images.length > 1 && 'cursor-grab active:cursor-grabbing'
            )}
            {...mouseAttrs({ mode: 'clickable' })}
          >
            <Img
              className="h-52 pointer-events-none"
              {...image.imageAttrs(208)}
            />
            <button
              type="button"
              className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white"
              onClick={() => {
                setImages((existing) =>
                  existing.filter((i) => i.id !== image.id)
                )
              }}
              title="Remove this image"
            >
              <X size={16} strokeWidth={1} />
            </button>
          </Reorder.Item>
        ))}
        {(multi || !images?.length) && (
          <li
            className={cn(
              'group flex items-center justify-center',
              !images.length && 'mx-auto'
            )}
          >
            <ImageUploadButton
              name={name}
              ref={uploadButton}
              multi={multi}
              prefix={prefix}
              onSuccess={(images) => {
                setImages((existing) => [...existing, ...images])
                setTimeout(() => {
                  input.current?.dispatchEvent(
                    new Event('change', { bubbles: true })
                  )
                }, 10)
              }}
              className="mx-12 my-20 flex h-11 w-11 items-center justify-center bg-white"
            >
              <Plus strokeWidth={1} size={28} />
            </ImageUploadButton>
          </li>
        )}
      </Reorder.Group>
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
