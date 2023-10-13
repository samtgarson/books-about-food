'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'
import { ChevronDown } from 'react-feather'

export const Root = Accordion.Root

export function Item({
  value,
  title,
  children,
  preChildren
}: {
  value: string
  title: ReactNode
  children: ReactNode
  preChildren?: ReactNode
}) {
  const triggerContent =
    typeof title === 'string' ? (
      <p className="mr-auto font-medium">{title}</p>
    ) : (
      title
    )
  return (
    <Accordion.Item value={value}>
      <Accordion.Header className="flex gap-4 items-center w-full h-12">
        {preChildren}
        <Accordion.Trigger className="grow flex gap-2 group items-center py-2">
          {triggerContent}
          <ChevronDown
            className="group-data-[state=open]:rotate-180 transition-transform"
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
