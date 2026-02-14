import { ReactNode } from 'react'

export function AccountHeader({
  title,
  children
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-20 font-medium">{title}</h2>
      {children}
    </div>
  )
}
