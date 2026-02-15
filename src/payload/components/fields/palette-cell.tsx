import type { DefaultCellComponentProps } from 'payload'
import { isHsl, toColorString } from '../../../utils/types'

export default function PaletteCell({ cellData }: DefaultCellComponentProps) {
  if (!Array.isArray(cellData) || cellData.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {cellData.map(function (item, i) {
        const color = item?.color
        if (!isHsl(color)) return null
        return (
          <span
            key={i}
            style={{
              display: 'block',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1px solid var(--theme-elevation-200)',
              backgroundColor: toColorString(color),
              flexShrink: 0
            }}
          />
        )
      })}
    </div>
  )
}
