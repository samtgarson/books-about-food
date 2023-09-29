import { AppErrorJSON, ErrorType } from 'src/services/utils/errors'
import type { FormErrors } from './context'

export function parseAppError(
  e: AppErrorJSON[],
  messages?: Record<string, { [key in ErrorType]?: string }>
) {
  return e.reduce<FormErrors>((errors, error) => {
    const field = error.field || '_'
    const message = messages?.[field]?.[error.type] || 'Something went wrong'
    return { ...errors, [field]: { message } }
  }, {})
}
