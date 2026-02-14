'use client'

import cn from 'classnames'
import { Accordion } from 'radix-ui'
import { ReactNode } from 'react'
import { ChevronDown } from 'src/components/atoms/icons'

export const Root = Accordion.Root

export function Item({
  value,
  title,
  children,
  preChildren,
  className
}: {
  value: string
  title: ReactNode
  children: ReactNode
  preChildren?: ReactNode
  className?: string
}) {
  const triggerContent =
    typeof title === 'string' ? <p className="font-medium">{title}</p> : title
  return (
    <Accordion.Item value={value}>
      <Accordion.Header className="flex w-full items-center gap-4">
        {preChildren}
        <Accordion.Trigger className="group flex grow items-center gap-2 py-2 text-left">
          {triggerContent}
          <ChevronDown
            className="ml-auto shrink-0 transition-transform group-data-[state=open]:rotate-180"
            strokeWidth={1}
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        className={cn(
          className,
          'overflow-hidden py-4 data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open'
        )}
      >
        {children}
      </Accordion.Content>
    </Accordion.Item>
  )
}
