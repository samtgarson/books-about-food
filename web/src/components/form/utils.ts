import {
  AppErrorJSON,
  ErrorType
} from '@books-about-food/core/services/utils/errors'
import type { FormErrors } from './context'

export function parseAppError(
  e: AppErrorJSON[],
  messages?: Record<string, { [key in ErrorType]?: string }>,
  aliasFields?: Record<string, string>
) {
  return e.reduce<FormErrors>((errors, error) => {
    let field = error.field
    if (field && aliasFields?.[field]) field = aliasFields[field]
    if (!field) field = '_'

    const message =
      messages?.[field]?.[error.type] || error.message || 'Something went wrong'
    return { ...errors, [field]: { message } }
  }, {})
}
