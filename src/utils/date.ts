export function dateString(date?: Date): string {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}
