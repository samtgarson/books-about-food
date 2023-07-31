'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from '../label'
import { Messages } from '../messages'
import * as Carousel from 'src/components/atoms/carousel'
import { ComponentProps, useRef, useState } from 'react'
import { X } from 'react-feather'
import { Image } from 'src/models/image'
import { ImageUploadButton } from './upload-button'
import Img from 'next/image'
import cn from 'classnames'

export type ImageUploadProps<Multi extends boolean> = {
  label: string
  name: string
  value?: Multi extends true ? Array<Image> : Image
  multi?: Multi
} & Omit<ComponentProps<'input'>, 'type' | 'multiple' | 'value'>

export function ImageUpload<Multi extends boolean = false>({
  label,
  name,
  multi,
  value,
  ...props
}: ImageUploadProps<Multi>) {
  const input = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<Image[]>(
    Array.isArray(value) ? value : !value ? [] : [value]
  )

  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required}>{label}</Label>
      <Form.Control asChild>
        <input
          name={name}
          {...props}
          type="text"
          className="opacity-0 h-0"
          ref={input}
          value={images.map((i) => i.id).join(',')}
        />
      </Form.Control>
      <Carousel.Root totalItems={multi ? images?.length + 1 || 1 : 1}>
        <Carousel.Scroller className="w-full py-12 bg-sand gap-6" padded>
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
                  multi={multi}
                  prefix="testing"
                  onSuccess={(images) => {
                    setImages((existing) => [...existing, ...images])
                  }}
                />
              </li>
            </Carousel.Item>
          )}
        </Carousel.Scroller>
      </Carousel.Root>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
