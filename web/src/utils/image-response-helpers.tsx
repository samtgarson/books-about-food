import Color from 'color'
import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { CSSProperties, ReactNode } from 'react'
import { LogoShape } from 'src/components/icons/logo-shape'

type FontOptions = Exclude<
  ConstructorParameters<typeof ImageResponse>[1],
  undefined
>['fonts']

export async function loadFonts(): Promise<FontOptions> {
  const [regularData, mediumData] = await Promise.all([
    readFile(join(process.cwd(), 'src/assets/fonts/Graphik-Regular-Trial.otf')),
    readFile(join(process.cwd(), 'src/assets/fonts/Graphik-Medium-Trial.otf'))
  ])

  return [
    {
      data: regularData,
      name: 'Graphik',
      style: 'normal',
      weight: 400
    },
    {
      data: mediumData,
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

async function response(content: JSX.Element) {
  const fonts = await loadFonts()

  return new ImageResponse(content, {
    width: dims.width,
    height: dims.height,
    fonts
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
  expanded?: boolean
}) {
  const flex: CSSProperties = centered
    ? { alignItems: 'center', justifyContent: 'center' }
    : { alignItems: 'flex-start', justifyContent: 'flex-end', flexShrink: 1 }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: right ? dims.gap : 0,
        marginRight: expanded ? dims.margin * -1 : 0,
        marginTop: expanded ? dims.margin * -1 : 0,
        marginBottom: expanded ? dims.margin * -1 : 0,
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
        lineHeight: 1.2
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
        opacity: 0.6
      }}
    >
      {children}
    </p>
  )
}

export const OGTemplate = { Root, Half, response, Title, Description }
