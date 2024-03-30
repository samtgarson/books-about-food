import { Profile } from '@books-about-food/core/models/profile'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import cloudflareLoader from 'src/lib/cloudflare/image-loader'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

const dims = {
  avatar: 180,
  gap: 45
}

export async function profilesIndexOgImage({ authors }: { authors: boolean }) {
  const { data } = await call(fetchProfiles, {
    onlyAuthors: authors,
    perPage: 7,
    withAvatar: true
  })

  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title>
          <span>
            {data?.total} {authors ? 'Authors' : 'People'}
          </span>
          <span>on Books About Food</span>
        </OGTemplate.Title>
      </OGTemplate.Half>
      {data && (
        <OGTemplate.Half
          expanded={dims.avatar * 0.65}
          style={{ flexDirection: 'row', paddingRight: dims.gap / 2 }}
        >
          <AvatarRow profiles={data?.profiles.slice(0, 4)} />
          <AvatarRow profiles={data?.profiles.slice(4)} right />
        </OGTemplate.Half>
      )}
    </OGTemplate.Root>
  )
}

function AvatarRow({
  profiles,
  right
}: {
  profiles: Profile[]
  right?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        gap: dims.gap,
        ...(right && {
          marginTop: dims.avatar / 2 + dims.gap / 2,
          marginLeft: dims.gap * 1.25
        })
      }}
    >
      {profiles.map(
        (profile) =>
          profile.avatar && (
            <img
              key={profile.id}
              src={cloudflareLoader({
                src: profile.avatar.path,
                width: dims.avatar,
                format: 'png'
              })}
              width={dims.avatar}
              height={dims.avatar}
              style={{ objectFit: 'cover', borderRadius: dims.avatar }}
            />
          )
      )}
    </div>
  )
}
