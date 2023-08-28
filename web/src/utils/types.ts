export type Serializable = Record<string, string | number | boolean | null>

export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]
