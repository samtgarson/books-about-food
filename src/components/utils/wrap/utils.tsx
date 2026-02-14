/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import hoistNonReactStatics from 'hoist-non-react-statics'
import { JSX } from 'react'
import SuperJSON from 'superjson'

export type SuperJSONProps<P> = P & {
  _superjson?: ReturnType<typeof SuperJSON.serialize>['meta']
}

export function serialize<P>(props: P): SuperJSONProps<P> {
  const { json, meta: _superjson } = SuperJSON.serialize(props)

  return {
    ...(json as any),
    _superjson
  }
}

export function deserializeProps<P>(serializedProps: SuperJSONProps<P>): P {
  const { _superjson, ...props } = serializedProps
  return SuperJSON.deserialize({ json: props as any, meta: _superjson })
}

export function withSuperJSONPage<P extends JSX.IntrinsicAttributes>(
  Page: React.ComponentType<P>
): React.ComponentType<SuperJSONProps<P>> {
  function WithSuperJSON(serializedProps: SuperJSONProps<P>) {
    return <Page {...deserializeProps<P>(serializedProps)} />
  }

  hoistNonReactStatics(WithSuperJSON, Page)

  return WithSuperJSON
}
