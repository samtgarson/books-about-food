import { BaseModel } from '@books-about-food/core/models'
import { can } from '@books-about-food/core/policies'
import { useCurrentUser } from 'src/hooks/use-current-user'

export function usePolicy<Resource extends BaseModel>(resource: Resource) {
  const user = useCurrentUser()
  return user && can(user, resource)
}
