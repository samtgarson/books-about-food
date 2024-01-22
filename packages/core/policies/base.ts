import { BaseModel } from '@books-about-food/core/models'
import { User } from '@books-about-food/core/types'

export class Policy<Resource extends BaseModel> {
  constructor(
    protected user: User,
    protected resource: Resource
  ) {}
}
