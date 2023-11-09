'use server'

import { Model } from 'core/models'
import { fetchBook } from 'core/services/books/fetch-book'
import { fetchProfile } from 'core/services/profiles/fetch-profile'
import { appUrl } from 'core/utils/app-url'
import { EmailTemplate } from 'email'
import { sendEmail } from 'src/pages/api/email'
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

  await sendEmail(EmailTemplate.SuggestEdit, 'aboutcookbooks@gmail.com', {
    userEmail: user.email,
    resourceName: resource.name,
    resourceType: resource._type,
    url: new URL(resource.href, appUrl).toString(),
    suggestion
  })
}
