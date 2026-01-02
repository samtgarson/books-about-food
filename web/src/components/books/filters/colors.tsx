import cn from 'classnames'
import { NamedColor } from 'src/core/services/books/colors'

export const colorMap: Record<NamedColor, string> = {
  [NamedColor.white]: '#ffffff',
  [NamedColor.yellow]: '#EED169',
  [NamedColor.orange]: '#DF864E',
  [NamedColor.red]: '#D94F41',
  [NamedColor.pink]: '#DC73C4',
  [NamedColor.purple]: '#823DE7',
  [NamedColor.blue]: '#5C89EF',
  [NamedColor.cyan]: '#86D2B9',
  [NamedColor.lime]: '#BAF37B',
  [NamedColor.green]: '#65A34E',
  [NamedColor.brown]: '#A3602F',
  [NamedColor.gray]: '#A9ADB2',
  [NamedColor.black]: '#000000'
}

export const rainbowGradient = `linear-gradient(rgb(84,166,236), rgb(84,166,236) 16%, rgb(155,210,94) 16%, rgb(155,210,94) 33%, rgb(246,229,98) 33%, rgb(246,229,98) 50%, rgb(239,173,92) 50%, rgb(239,173,92) 67%, rgb(237,109,93) 67%, rgb(237,109,93) 83%, rgb(146,83,146) 83%, rgb(146,83,146))`

export function ColorCircle({
  color,
  className,
  selected,
  onClick
}: {
  color: string
  className?: string
  selected?: boolean
  onClick?: () => void
}) {
  const hex =
    color in colorMap ? colorMap[color as keyof typeof colorMap] : color
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      style={{
        background: color === 'rainbow' ? rainbowGradient : hex
      }}
      className={cn(
        'size-12 rounded-full border transition-colors',
        selected
          ? 'border-black'
          : hex === '#ffffff'
            ? 'border-neutral-grey'
            : 'border-transparent',
        className
      )}
      onClick={onClick}
    ></Tag>
  )
}
