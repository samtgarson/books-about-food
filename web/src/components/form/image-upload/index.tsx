'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from '../label'
import { Messages } from '../messages'
import * as Carousel from 'src/components/atoms/carousel'
import { useRef, useState } from 'react'
import { Plus, X } from 'react-feather'
import { Image } from 'src/models/image'
import { ImageUploadButton } from './upload-button'
import Img from 'next/image'
import cn from 'classnames'
import { InputProps, useRequired } from '../input-props'
import { mouseAttrs } from 'src/components/atoms/mouse'

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
          className="opacity-0 h-0"
          ref={input}
          value={images.map((i) => i.id).join(',')}
        />
      </Form.Control>
      <Carousel.Root totalItems={multi ? images?.length + 1 || 1 : 1}>
        <Carousel.Scroller
          className={cn(
            'w-full py-12 bg-sand gap-6',
            !images.length && 'cursor-pointer'
          )}
          {...mouseAttrs({ mode: 'clickable', enabled: !images.length })}
          padded
          onClick={() => {
            if (images.length) return
            uploadButton.current?.click()
          }}
        >
          {images.map((image) => (
            <Carousel.Item index={0} key={image.id}>
              <li
                className={cn(
                  'relative',
                  images.length === 1 && !multi && 'mx-auto'
                )}
              >
                <Img className="h-52" {...image.imageAttrs(208)} />
                <button
                  type="button"
                  className="absolute -top-3 -right-3 w-6 h-6 bg-white flex items-center justify-center rounded-full"
                  onClick={() => {
                    setImages((existing) =>
                      existing.filter((i) => i.id !== image.id)
                    )
                  }}
                  title="Remove this image"
                >
                  <X size={16} strokeWidth={1} />
                </button>
              </li>
            </Carousel.Item>
          ))}
          {(multi || !images?.length) && (
            <Carousel.Item index={0}>
              <li
                className={cn(
                  'group flex justify-center items-center',
                  !images.length && 'mx-auto'
                )}
              >
                <ImageUploadButton
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
                  className="bg-white w-11 h-11 flex justify-center items-center my-20 mx-12"
                >
                  <Plus strokeWidth={1} size={28} />
                </ImageUploadButton>
              </li>
            </Carousel.Item>
          )}
        </Carousel.Scroller>
      </Carousel.Root>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
