'use server'

import {
  ImportBooksInput,
  importBooks
} from 'core/services/import/import-books'
import {
  ProcessBookImportInput,
  processBookImport
} from 'core/services/import/import-books/process-book-import'
import { parseAndCall } from 'src/utils/service'

export async function parseCsv(input: ImportBooksInput) {
  return parseAndCall(importBooks, input)
}

export async function process(input: ProcessBookImportInput) {
  return parseAndCall(processBookImport, input)
}
