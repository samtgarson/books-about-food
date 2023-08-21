// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref']

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }
