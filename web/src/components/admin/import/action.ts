'use server'

import { ImportBooksInput } from '@books-about-food/core/services/import/import-books'
import { ProcessBookImportInput } from '@books-about-food/core/services/import/import-books/process-book-import'

// TODO: Move import to admin API

export async function parseCsv(_input: ImportBooksInput) {
  // return parseAndCall(importBooks, input)
}

export async function process(_input: ProcessBookImportInput) {
  // return parseAndCall(processBookImport, input)
}
