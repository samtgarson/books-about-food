/**
 * Shared HTML classes for editor content styling.
 * Uses Tailwind Typography plugin prose classes.
 */
export const htmlClasses = 'prose prose-strong:font-medium prose-a:font-normal'

/**
 * Strips empty paragraph tags from the start and end of HTML content.
 * Used to clean up editor output.
 */
export function stripEmptyParagraphs(html: string): string {
  return html.replace(/(^(<p><\/p>)+)|((<p><\/p>)+$)/g, '')
}
