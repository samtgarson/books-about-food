import { profilesIndexOgImage } from './image'

export const revalidate = 3600

export async function GET() {
  return profilesIndexOgImage()
}
