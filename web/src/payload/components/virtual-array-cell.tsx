'use client'

import { DefaultCellComponentProps } from 'payload'

export default function StringArrayCell({
  cellData
}: DefaultCellComponentProps) {
  return <>{Array.isArray(cellData) ? cellData.join(', ') : cellData}</>
}
