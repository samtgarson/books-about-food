import { appUrl } from '@books-about-food/shared/utils/app-url'

export async function revalidatePath(...segments: string[]) {
  const url = appUrl(`/api/admin/revalidate-path?path=/${segments.join('/')}`)
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `${process.env.FOREST_AUTH_SECRET}`
    }
  })
  if (res.ok) console.log(await res.json())
  else console.error(await res.json())
}
