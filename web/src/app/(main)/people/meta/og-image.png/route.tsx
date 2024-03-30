import { profilesIndexOgImage } from './image'

export const revalidate = 60 * 60 // 1 hour

export async function GET() {
  return profilesIndexOgImage({ authors: false })
}
