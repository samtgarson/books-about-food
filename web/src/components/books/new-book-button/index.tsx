'use client'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import { Plus } from 'src/components/atoms/icons'
import * as Sheet from 'src/components/atoms/sheet'

const Form = dynamic(async () => (await import('./content')).NewBookForm)

export const NewBookButton = ({
  children,
  className
}: {
  children?: ReactNode
  className?: string
}) => {
  const triggerContent = children ?? (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p className="text-left">Submit a new cookbook</p>
    </>
  )
  return (
    <Sheet.Root>
      <Sheet.Trigger
        className={cn('flex items-center gap-4', className)}
        aria-label="Submit a new cookbook"
      >
        {triggerContent}
      </Sheet.Trigger>
      <Sheet.Content authenticated>
        <Sheet.Body title="Submit a new cookbook">
          <Form />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
