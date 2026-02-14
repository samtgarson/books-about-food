'use client'

import * as React from 'react'
import { JSX } from 'react'
import { SuperJSONProps, withSuperJSONPage } from './utils'

export default function WrapClient<P extends JSX.IntrinsicAttributes>({
  component,
  props,
  children
}: {
  component: React.ComponentType<P>
  props: SuperJSONProps<P>
  children?: React.ReactNode
}) {
  const WithSuperJSON = withSuperJSONPage(component)
  return <WithSuperJSON {...props}>{children}</WithSuperJSON>
}
