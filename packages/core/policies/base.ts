import { User } from '@books-about-food/core/types'

export class Policy<Resource> {
  constructor(
    protected user: User,
    protected resource: Resource
  ) {}
}
