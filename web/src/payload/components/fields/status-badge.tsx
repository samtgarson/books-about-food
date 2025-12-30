export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'draft'

const statusStyles: Record<
  StatusType,
  { bg: string; text: string; border: string }
> = {
  success: {
    bg: 'var(--theme-success-100)',
    text: 'var(--theme-success-500)',
    border: 'var(--theme-success-200)'
  },
  warning: {
    bg: 'var(--theme-warning-100)',
    text: 'var(--theme-warning-500)',
    border: 'var(--theme-warning-200)'
  },
  error: {
    bg: 'var(--theme-error-100)',
    text: 'var(--theme-error-500)',
    border: 'var(--theme-error-200)'
  },
  info: {
    bg: 'var(--theme-elevation-100)',
    text: 'var(--theme-elevation-600)',
    border: 'var(--theme-elevation-200)'
  },
  draft: {
    bg: 'var(--theme-elevation-50)',
    text: 'var(--theme-elevation-500)',
    border: 'var(--theme-elevation-150)'
  }
}

type StatusBadgeProps = {
  label: string
  statusType: StatusType
}

export function StatusBadge({ label, statusType }: StatusBadgeProps) {
  const styles = statusStyles[statusType]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        fontSize: '13px',
        fontWeight: 500,
        borderRadius: '4px',
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`
      }}
    >
      {label}
    </span>
  )
}
