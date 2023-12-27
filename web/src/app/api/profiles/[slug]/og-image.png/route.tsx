import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { LogoShape } from 'src/components/icons/logo-shape'
import { call } from 'src/utils/service'

const dims = {
  width: 1200,
  height: 630,
  margin: 136,
  gap: 64,
  avatar: 360
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const { data } = await call(fetchProfiles, {
    onlyPublished: true,
    perPage: 0
  })
  return data?.profiles.map(({ slug }) => ({ slug })) ?? []
}

export async function GET(
  _request: NextRequest,
  {
    params: { slug }
  }: {
    params: { slug: string }
  }
) {
  const { data: profile } = await call(fetchProfile, {
    slug,
    onlyPublished: true
  })
  if (!profile) return new Response('Not Found', { status: 404 })
  const { avatar } = profile
  const fontUrl = new URL(
    '../../../../../assets/fonts/Graphik-Regular-Trial.otf',
    new URL(import.meta.url)
  )
  const fontData = await readFile(fontUrl)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: dims.width,
          height: dims.height,
          backgroundColor: 'white',
          position: 'relative',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 136,
          paddingRight: 136,
          fontFamily: '"Graphik"'
        }}
      >
        {avatar && (
          <img
            src={avatar.src}
            width={dims.width / 2 + 100}
            height={dims.height}
            style={{
              position: 'absolute',
              left: dims.width / 2 - 100,
              right: 0,
              objectFit: 'cover',
              filter: 'blur(50px)',
              opacity: 0.2
            }}
          />
        )}
        {avatar && (
          <div
            style={{
              position: 'absolute',
              left: dims.width / 2 - 100,
              backgroundImage:
                'linear-gradient(to right, white, rgba(255,255,255,0))',
              width: 200,
              top: 0,
              height: dims.height
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: dims.gap,
            width: dims.width - (dims.avatar + dims.gap + dims.margin * 2)
          }}
        >
          <p
            style={{
              fontSize: 64,
              lineHeight: 1.1
            }}
          >
            {profile.name}
          </p>
          {profile.jobTitle && (
            <p
              style={{
                fontSize: 32,
                opacity: 0.6
              }}
            >
              {profile.jobTitle}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            width: dims.avatar,
            height: dims.avatar,
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {avatar ? (
            <img
              src={avatar.src}
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
          <LogoShape
            text
            width={136}
            height={146}
            style={{ position: 'absolute', bottom: -10, right: -10 }}
          />
        </div>
      </div>
    ),
    {
      width: dims.width,
      height: dims.height,
      fonts: [
        {
          data: fontData,
          name: 'Graphik',
          style: 'normal',
          weight: 400
        }
      ]
    }
  )
}
