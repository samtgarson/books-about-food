/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseModel {
  abstract _type: Model
  abstract href: string
  abstract name: string

  static isModel(obj: unknown): obj is BaseModel {
    return obj instanceof BaseModel
  }
}

export type Model = 'profile' | 'book' | 'publisher' | 'post' | 'collection'
