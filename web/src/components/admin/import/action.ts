'use server'

import { ImportBooksInput, importBooks } from 'src/services/import/import-books'
import {
  ProcessBookImportInput,
  processBookImport
} from 'src/services/import/import-books/process-book-import'

export async function parseCsv(input: ImportBooksInput) {
  return importBooks.parseAndCall(input)
}

export async function process(input: ProcessBookImportInput) {
  return processBookImport.parseAndCall(input)
}
