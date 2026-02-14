import xss from 'xss'

export function sanitizeHtml(html?: string | null) {
  if (!html) return html
  if (!html.length) return null
  return xss(html)
}
