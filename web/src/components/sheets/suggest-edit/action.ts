'use server'

import { inngest } from '@books-about-food/core/jobs'
import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

type Model = 'profile' | 'book'

const fetcher = (type: Model) => {
  switch (type) {
    case 'book':
      return fetchBook
    case 'profile':
      return fetchProfile
  }
}

export async function action(
  resourceType: Model,
  slug: string,
  suggestion: string
) {
  const user = await getSessionUser()
  const { data: resource } = await call(fetcher(resourceType), { slug })
  if (!resource || !user?.email) return

  await inngest.send({
    name: 'jobs.email',
    data: {
      key: 'suggestEdit',
      props: {
        userEmail: user.email,
        resourceName: resource.name,
        resourceType: resource._type,
        url: appUrl(resource.href),
        suggestion
      }
    },
    user: { email: 'jamin@booksabout.food' }
  })
}
