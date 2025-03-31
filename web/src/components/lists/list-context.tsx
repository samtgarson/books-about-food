'use client'

import cn from 'classnames'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AntiContainer, Container } from '../atoms/container'
import { DisplayToggle } from './display-toggle'

export type ListDisplay = 'list' | 'grid'
type ListContext = {
  display: ListDisplay
  setDisplay: (display: ListDisplay) => void
}

const ListContext = createContext<ListContext>({
  display: 'list'
} as ListContext)

export type ListContainerProps = {
  children: ReactNode
  title?: string
  display?: ListDisplay
  className?: string
}
export function ListContainer({
  children,
  title,
  display: initialDisplay = 'list',
  className
}: ListContainerProps) {
  const [display, setDisplay] = useState<ListDisplay>(initialDisplay)

  if (!title)
    return (
      <ListContext.Provider value={{ display, setDisplay }}>
        {children}
      </ListContext.Provider>
    )

  return (
    <ListContext.Provider value={{ display, setDisplay }}>
      <AntiContainer desktop={false} className={cn(className)}>
        <Container desktop={false}>
          {title && (
            <h3 className="all-caps my-4 flex items-center justify-between sm:mb-8 sm:mt-0">
              {title}
              <DisplayToggle className="sm:hidden" />
            </h3>
          )}
          {children}
        </Container>
      </AntiContainer>
    </ListContext.Provider>
  )
}

export const useListDisplay = () =>
  useContext(ListContext) || { display: 'list' }
