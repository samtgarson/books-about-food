import { profilesIndexOgImage } from 'app/(main)/people/meta/og-image.png/image'

export const revalidate = 3600 // 1 hour

export async function GET() {
  return profilesIndexOgImage({ authors: true })
}
