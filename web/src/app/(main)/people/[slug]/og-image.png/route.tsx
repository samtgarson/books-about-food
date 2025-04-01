import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { NextRequest } from 'next/server'
import cloudflareLoader from 'src/lib/cloudflare/image-loader'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

const dims = {
  avatar: 360
}

export const revalidate = 3600

export async function GET(
  _request: NextRequest,
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await props.params

  const { data: profile } = await call(fetchProfile, {
    slug,
    onlyPublished: true
  })
  if (!profile) return new Response('Not Found', { status: 404 })
  const { avatar } = profile

  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title>{profile.name}</OGTemplate.Title>
        {profile.jobTitle && (
          <OGTemplate.Description>{profile.jobTitle}</OGTemplate.Description>
        )}
      </OGTemplate.Half>
      <OGTemplate.Half right centered>
        {avatar ? (
          <img
            src={cloudflareLoader({
              src: avatar.path,
              width: dims.avatar,
              format: 'png'
            })}
            width={dims.avatar}
            height={dims.avatar}
            style={{ borderRadius: dims.avatar, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              borderRadius: dims.avatar,
              width: dims.avatar,
              height: dims.avatar,
              backgroundColor: profile.backgroundColour,
              color: profile.foregroundColour,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 64
            }}
          >
            {profile.initials}
          </div>
        )}
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}
