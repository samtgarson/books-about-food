'use client'

import { FC, ReactNode } from 'react'
import cn from 'classnames'
import * as Dialog from '@radix-ui/react-dialog'
import { Container } from './container'
import { X } from 'react-feather'

export type SheetProps = {
  children: ReactNode
  content: ReactNode
  mobileOnly?: boolean
  className?: string
  title: string
  triggerClassName?: string
}

export const Sheet: FC<SheetProps> = ({
  children,
  content,
  mobileOnly,
  className,
  title,
  triggerClassName
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          triggerClassName,
          mobileOnly && 'pointer-events-auto sm:pointer-events-none'
        )}
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 animate-fade-in" />
        <Dialog.Content
          className="flex flex-col justify-end fixed inset-x-0 bottom-0 z-50 animate-fade-slide-in"
          aria-describedby={undefined}
        >
          <Dialog.Close className="p-4 self-end">
            <X strokeWidth={1} size={24} className="stroke-white" />
          </Dialog.Close>
          <Container className={cn('bg-white pt-8', className)}>
            <Dialog.Title className="mb-4">{title}</Dialog.Title>
            {content}
          </Container>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
