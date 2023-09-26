'use client'

import cn from 'classnames'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AntiContainer, Container } from '../atoms/container'
import { DisplayToggle } from './display-toggle'

type ListDisplay = 'list' | 'grid'
type ListContext = { display: ListDisplay }

const ListContext = createContext<ListContext>({ display: 'list' })

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
      <ListContext.Provider value={{ display }}>
        {children}
      </ListContext.Provider>
    )

  return (
    <ListContext.Provider value={{ display }}>
      <AntiContainer
        desktop={false}
        className={cn('border-t border-black sm:border-t-0', className)}
      >
        <Container desktop={false}>
          {title && (
            <h3 className="my-4 sm:mb-8 sm:mt-0 all-caps flex items-center justify-between">
              {title}
              <DisplayToggle
                className="sm:hidden"
                display={display}
                onChange={setDisplay}
              />
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
