import type {
  DefaultCellComponentProps,
  SelectFieldServerComponent
} from 'payload'
import { StatusBadge, type StatusType } from '../fields/status-badge'

const statusConfig: Record<string, { label: string; statusType: StatusType }> =
  {
    pending: { label: 'Pending', statusType: 'warning' },
    approved: { label: 'Approved', statusType: 'success' },
    cancelled: { label: 'Cancelled', statusType: 'error' }
  }

export const ClaimStatusField: SelectFieldServerComponent = ({
  data,
  field
}) => {
  const value = data?.[field.name] as string | undefined
  const config = statusConfig[value ?? 'pending']

  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--theme-elevation-800)'
        }}
      >
        Status
      </label>
      <StatusBadge label={config.label} statusType={config.statusType} />
    </div>
  )
}

export function ClaimStatusCell({ cellData }: DefaultCellComponentProps) {
  const config = statusConfig[(cellData as string) ?? 'pending']
  return <StatusBadge label={config.label} statusType={config.statusType} />
}
