import { cleanImages } from './clean-images'
import { convertWebp } from './convert-webp'
import { email } from './email'
import { generatePalette } from './generate-palette'
import { sendVerification } from './resend-verification'

export const functions = [
  generatePalette,
  email,
  cleanImages,
  sendVerification,
  convertWebp
]
