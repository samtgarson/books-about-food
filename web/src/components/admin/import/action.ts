'use server'

import {
  ImportBooksInput,
  importBooks
} from '@books-about-food/core/services/import/import-books'
import {
  ProcessBookImportInput,
  processBookImport
} from '@books-about-food/core/services/import/import-books/process-book-import'
import { call } from 'src/utils/service'

export async function parseCsv(input: ImportBooksInput) {
  return call(importBooks, input)
}

export async function process(input: ProcessBookImportInput) {
  return call(processBookImport, input)
}
