import { Edit2, IconProps } from 'react-feather'

export * from 'react-feather'

export const PencilMini = ({ strokeWidth = 1, ...props }: IconProps) => (
  <Edit2
    {...props}
    strokeWidth={Number(strokeWidth) * 1.5}
    style={{ padding: 4 }}
  />
)
