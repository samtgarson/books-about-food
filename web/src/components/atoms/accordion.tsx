'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'
import { ChevronDown } from 'react-feather'

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
    typeof title === 'string' ? (
      <p className="mr-auto font-medium">{title}</p>
    ) : (
      title
    )
  return (
    <Accordion.Item value={value} className={className}>
      <Accordion.Header className="flex gap-4 items-center w-full h-12">
        {preChildren}
        <Accordion.Trigger className="grow flex gap-2 group items-center py-2 text-left">
          {triggerContent}
          <ChevronDown
            className="group-data-[state=open]:rotate-180 transition-transform shrink-0"
            strokeWidth={1}
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  )
}
