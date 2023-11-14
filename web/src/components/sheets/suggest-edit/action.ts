'use server'

import { inngest } from 'core/gateways/inngest'
import { Model } from 'core/models'
import { fetchBook } from 'core/services/books/fetch-book'
import { fetchProfile } from 'core/services/profiles/fetch-profile'
import { appUrl } from 'core/utils/app-url'
import { call, getUser } from 'src/utils/service'

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
  const user = await getUser()
  const { data: resource } = await call(fetcher(resourceType), { slug })
  if (!resource || !user?.email) return

  await inngest.send({
    name: 'email',
    data: {
      key: 'suggestEdit',
      props: {
        userEmail: user.email,
        resourceName: resource.name,
        resourceType: resource._type,
        url: new URL(resource.href, appUrl).toString(),
        suggestion
      }
    },
    user: { email: 'aboutcookbooks@gmail.com' }
  })
}
