export type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>

export type CamelCaseKeys<T extends Record<string, unknown>> = {
  [K in keyof T as K extends string
    ? CamelCase<K>
    : never]: T[K] extends Record<string, unknown> ? CamelCaseKeys<T[K]> : T[K]
}

export type NonEmptyArray<T> = [T, ...T[]]
