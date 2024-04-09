import { appUrl } from '@books-about-food/shared/utils/app-url'

export async function revalidatePath(...segments: string[]) {
  const path = encodeURIComponent(`/${segments.join('/')}`)
  const url = appUrl(`/api/admin/revalidate-path?path=${path}`)
  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `${process.env.FOREST_AUTH_SECRET}`
    }
  })
}
