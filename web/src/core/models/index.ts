import { Route } from 'next'

export abstract class BaseModel {
  abstract _type: Model
  abstract href: Route<string>
  abstract name: string

  static isModel(obj: unknown): obj is BaseModel {
    return obj instanceof BaseModel
  }
}

export type Model =
  | 'profile'
  | 'book'
  | 'publisher'
  | 'post'
  | 'collection'
  | 'location'
