'use server'

import { EmailTemplate } from 'email'
import { Model } from 'src/models'
import { sendEmail } from 'src/pages/api/email'
import { getUser } from 'src/services/auth/get-user'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchProfile } from 'src/services/profiles/fetch-profile'
import { appUrl } from 'src/utils/app-url'

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
  const { data: user } = await getUser.call()
  const { data: resource } = await fetcher(resourceType).call({ slug })
  if (!resource || !user?.email) return

  await sendEmail(EmailTemplate.SuggestEdit, 'aboutcookbooks@gmail.com', {
    userEmail: user.email,
    resourceName: resource.name,
    resourceType: resource._type,
    url: new URL(resource.href, appUrl).toString(),
    suggestion
  })
}
