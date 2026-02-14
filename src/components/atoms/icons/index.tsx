import { Edit2, LucideProps } from 'lucide-react'
import { ComponentType } from 'react'

export * from 'lucide-react'
export type IconProps = LucideProps
export type Icon = ComponentType<IconProps>

export const PencilMini = ({ strokeWidth = 1, ...props }: IconProps) => (
  <Edit2
    {...props}
    strokeWidth={Number(strokeWidth) * 1.5}
    style={{ padding: 4 }}
  />
)
