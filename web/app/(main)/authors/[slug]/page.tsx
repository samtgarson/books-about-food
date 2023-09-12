import { ProfilePage } from 'src/components/pages/profile-page'
import { PageProps } from 'src/components/types'

export * from 'app/default-static-config'

export default function PeoplePage({
  params: { slug }
}: PageProps<{ slug: string }>) {
  return <ProfilePage segment="authors" slug={slug} />
}
