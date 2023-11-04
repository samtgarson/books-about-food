'use client'

import { ReactNode } from 'react'
import { useForm } from './context'

export function Group({
  children,
  if: ifField
}: {
  children: ReactNode
  if?: string | string[]
}) {
  const form = useForm()
  const fields = Array.isArray(ifField) ? ifField : [ifField]
  const show = !ifField || fields.some((f) => f && form.state[f])

  if (show) return <>{children}</>
  return null
}
