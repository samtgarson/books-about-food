export abstract class BaseModel {
  abstract _type: Model
  abstract href: string
  abstract name: string
}

export type Model = 'profile' | 'book'
