import { cleanImages } from './clean-images'
import { convertWebp } from './convert-webp'
import { email } from './email'
import { generatePalette } from './generate-palette'
import { sendVerification } from './resend-verification'
import { sendVoteReminder } from './send-vote-reminder'

export const functions = [
  cleanImages,
  generatePalette,
  email,
  sendVerification,
  convertWebp,
  sendVoteReminder
]
