"use client"

import { JSX } from "react"
import { SuperJSONProps, withSuperJSONPage } from "./utils"
import * as React from "react"

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

