'use client'

import { useField } from '@payloadcms/ui'

export function ColorPickerField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '40px',
          height: '40px',
          padding: 0,
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder="#000000"
        style={{
          flex: 1,
          padding: '8px 12px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)'
        }}
      />
    </div>
  )
}
