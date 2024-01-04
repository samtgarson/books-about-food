'use client'

import Link from 'next/link'
import { ReactNode, RefObject, createContext, useContext, useRef } from 'react'
import { ParamLink } from 'src/components/atoms/param-link'

type PaginationContext = { ref: RefObject<HTMLDivElement> }
const PaginationContext = createContext({} as PaginationContext)

export const Wrapper = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <PaginationContext.Provider value={{ ref }}>
      <div
        ref={ref}
        className="-mt-60 pt-60 relative pointer-events-none *:pointer-events-auto"
      >
        {children}
      </div>
    </PaginationContext.Provider>
  )
}

export const Button = ({
  page,
  children,
  onClick: externalOnClick
}: {
  page: number
  children: ReactNode
  onClick?: () => void
}) => {
  const ctx = useContext(PaginationContext) as Partial<PaginationContext>
  const onClick = () => {
    ctx.ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    externalOnClick?.()
  }

  if (externalOnClick) {
    return (
      <li key={page} className="list-none">
        <button onClick={onClick}>{children}</button>
      </li>
    )
  }

  return (
    <li key={page} className="list-none">
      <ParamLink page={page || undefined}>
        <Link href="" scroll={false} onClick={onClick}>
          {children}
        </Link>
      </ParamLink>
    </li>
  )
}
