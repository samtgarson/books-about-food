export abstract class BaseModel {
  abstract _type: string
  abstract href: string
  abstract name: string
}

export type Model = 'profile' | 'book'
