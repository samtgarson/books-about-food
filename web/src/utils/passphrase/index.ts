/**
 * Copied from https://github.com/aldy505/generate-passphrase
 * Revert to NPM library when vercel filesystem issue is fixed
 *
 * @module generate-passphrase
 * @author Reinaldy Rafli <aldy505@tutanota.com>
 * @license MIT
 */
import { words } from './words'

export interface generateOptions {
  length?: number
  separator?: string
  numbers?: boolean
  uppercase?: boolean
  titlecase?: boolean
  pattern?: string
  fast?: boolean
}

const wordArray = words.split('\n')
function getRandomWord(): string {
  const randomInt = Math.floor(Math.random() * wordArray.length)
  return wordArray[randomInt]
}

/**
 * Generate a passphrase with options
 * @param {generateOptions} options - The options
 * @returns {string} - A passphrase
 * @see Usage https://github.com/aldy505/generate-passphrase#how-to-use-this
 */
export function generate(options: generateOptions = {}): string {
  const defaults: generateOptions = {
    length: 4,
    separator: '-',
    numbers: true,
    uppercase: false,
    titlecase: false,
    pattern: undefined,
    fast: false
  }

  const opts = { ...defaults, ...options }

  if (!opts.length || opts.length <= 0) {
    throw new Error(
      'Length should be 1 or bigger. It should not be zero or lower.'
    )
  }

  const passphraseArray: Array<string | number> = []

  const pattern = 'WWW'

  const eachPattern = pattern.split('')
  for (let i = 0; i < eachPattern.length; i += 1) {
    if (eachPattern[i] === 'W') {
      const word = getRandomWord()
      if (opts.uppercase) {
        passphraseArray.push(word.toUpperCase())
      } else if (opts.titlecase) {
        passphraseArray.push(
          word.replace(
            /\w\S*/g,
            (text) =>
              text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
          )
        )
      } else {
        passphraseArray.push(word)
      }
    } else {
      throw new Error('Unknown pattern found. Use N or W instead.')
    }
  }

  const passphrase = passphraseArray.join(opts.separator)
  return passphrase
}
