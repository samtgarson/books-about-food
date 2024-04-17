import Color from 'color'
import { ImageResponse } from 'next/og'
import { CSSProperties, ReactNode } from 'react'
import { LogoShape } from 'src/components/icons/logo-shape'

type FontOptions = Exclude<
  ConstructorParameters<typeof ImageResponse>[1],
  undefined
>['fonts']

export async function loadFonts(): Promise<FontOptions> {
  const [regularData, mediumData] = await Promise.all([
    fetch(
      'https://assets.booksaboutfood.info/fonts%2FGraphik-Regular-Trial.otf'
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://assets.booksaboutfood.info/fonts%2FGraphik-Medium-Trial.otf'
    ).then((res) => res.arrayBuffer())
  ])

  return [
    {
      data: Buffer.from(regularData),
      name: 'Graphik',
      style: 'normal',
      weight: 400
    },
    {
      data: Buffer.from(mediumData),
      name: 'Graphik',
      style: 'normal',
      weight: 700
    }
  ]
}

const dims = {
  width: 1200,
  height: 630,
  margin: 100,
  leftPadding: 36,
  gap: 100
}

export const size = { width: dims.width, height: dims.height }

async function response(content: JSX.Element) {
  const fonts = await loadFonts()

  return new ImageResponse(content, {
    width: dims.width,
    height: dims.height,
    fonts,
    debug: false,
    headers: {
      'Cache-Control': 'public, max-age=86400'
    }
  })
}

function Root({
  backgroundColor = '#F0EEEB',
  children
}: {
  backgroundColor?: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: dims.width,
        height: dims.height,
        backgroundColor,
        position: 'relative',
        paddingLeft: dims.margin + dims.leftPadding,
        paddingRight: dims.margin,
        paddingBottom: dims.margin,
        paddingTop: dims.margin,
        fontFamily: '"Graphik"',
        color: new Color(backgroundColor).isDark() ? 'white' : 'black'
      }}
    >
      <LogoShape
        text
        width={120}
        height={120}
        style={{ position: 'absolute', top: dims.margin, left: dims.margin }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          width: '100%'
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Half({
  style = {},
  centered = false,
  children,
  right,
  expanded
}: {
  style?: CSSProperties
  centered?: boolean
  children: ReactNode
  right?: boolean
  expanded?: boolean | number
}) {
  const flex: CSSProperties = centered
    ? { alignItems: 'center', justifyContent: 'center' }
    : { alignItems: 'flex-start', justifyContent: 'flex-end', flexShrink: 1 }

  const expandedMargin =
    typeof expanded === 'number' ? expanded + dims.margin : dims.margin
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        marginLeft: right ? dims.gap : 0,
        marginRight: expanded ? expandedMargin * -1 : 0,
        marginTop: expanded ? expandedMargin * -1 : 0,
        marginBottom: expanded ? expandedMargin * -1 : 0,
        ...flex,
        ...style
      }}
    >
      {children}
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 64,
        lineHeight: 1.4,
        marginBottom: 0,
        flexDirection: 'column',
        gap: 6
      }}
    >
      {children}
    </p>
  )
}
function Description({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 32,
        opacity: 0.6,
        marginBottom: 0
      }}
    >
      {children}
    </p>
  )
}

export const OGTemplate = { Root, Half, response, Title, Description }
