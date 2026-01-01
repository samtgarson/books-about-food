/**
 * Convert FAQ answers from HTML to Lexical format
 *
 * Run after migrate-data.sql to convert HTML answers to Payload's Lexical rich text format.
 *
 * Usage: npx tsx src/payload/migrations/from-prisma/convert-faq-answers.ts
 */
import 'dotenv/config'

import {
  convertHTMLToLexical,
  editorConfigFactory
} from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import pg from 'pg'

import config from 'src/payload.config'

async function convertFaqAnswers() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
  })

  await client.connect()
  console.log('Connected to database')

  try {
    // Get the editor config from Payload
    const editorConfig = await editorConfigFactory.default({
      config: await config
    })

    // Fetch all FAQs with their HTML answers from the public schema
    const { rows: faqs } = await client.query<{ id: string; answer: string }>(
      'SELECT id, answer FROM public.frequently_asked_questions WHERE answer IS NOT NULL'
    )

    console.log(`Found ${faqs.length} FAQs to convert`)

    let successCount = 0
    let errorCount = 0

    for (const faq of faqs) {
      try {
        // Convert HTML to Lexical format
        const lexicalContent = convertHTMLToLexical({
          editorConfig,
          html: faq.answer,
          JSDOM
        })

        // Update the payload.faqs table with the converted content
        await client.query(
          'UPDATE payload.faqs SET answer = $1 WHERE id = $2',
          [JSON.stringify(lexicalContent), faq.id]
        )

        successCount++
        console.log(`Converted FAQ ${faq.id}`)
      } catch (error) {
        errorCount++
        console.error(`Failed to convert FAQ ${faq.id}:`, error)
      }
    }

    console.log(`\nConversion complete:`)
    console.log(`  Success: ${successCount}`)
    console.log(`  Errors: ${errorCount}`)
  } finally {
    await client.end()
  }
}

convertFaqAnswers().catch(console.error)
