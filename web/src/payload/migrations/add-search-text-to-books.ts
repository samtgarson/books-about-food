import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres/drizzle'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Add the search_text column
  await payload.db.drizzle.execute(sql`
    ALTER TABLE books
    ADD COLUMN IF NOT EXISTS search_text VARCHAR;
  `)

  // Create an index for better search performance
  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS books_search_text_idx
    ON books (search_text);
  `)

  // Optionally populate searchText for existing books
  // This will be done automatically by the hook on next update,
  // but we can trigger it manually for all books if needed
  console.log('✓ Added search_text column to books table')
  console.log(
    'ℹ  Existing books will have search_text populated on next update'
  )
  console.log(
    '   Or run: UPDATE books SET updated_at = updated_at to trigger hook for all books'
  )
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Drop the index
  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS books_search_text_idx;
  `)

  // Remove the column
  await payload.db.drizzle.execute(sql`
    ALTER TABLE books
    DROP COLUMN IF EXISTS search_text;
  `)

  console.log('✓ Removed search_text column from books table')
}
