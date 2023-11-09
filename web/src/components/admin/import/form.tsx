'use client'

import { ResultRow } from 'core/services/import/import-books/types'
import { AppErrorJSON } from 'core/services/utils/errors'
import { useState } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { parseCsv } from './action'
import { ImportList } from './list'

export function ImportForm() {
  const [preview, setPreview] = useState<ResultRow[]>()
  const [errors, setErrors] = useState<AppErrorJSON[]>()

  async function processCSV(data: Record<string, unknown>) {
    const { file } = data as { file: File }
    if (file.size > 1000000)
      return { file: { message: 'File size must be less than 1mb' } }
    const csv = new TextDecoder('utf-8').decode(await file.arrayBuffer())

    const result = await parseCsv({ csv })
    if (result.success) {
      setPreview(result.data)
    } else {
      setErrors(result.errors)
    }
  }

  function onSuccess(ids: Set<string>) {
    setPreview((preview) => preview?.filter((result) => !ids.has(result.id)))
  }

  return (
    <Form action={processCSV}>
      <h3 className="text-16 font-medium">Import Books</h3>
      <Input required label="CSV" name="file" type="file" accept=".csv" />
      <Submit variant="dark">Preview</Submit>
      {(preview || errors) && (
        <Sheet.Root defaultOpen onClose={() => setPreview(undefined)}>
          <Sheet.Content size="xl">
            <Sheet.Body className="flex flex-col overflow-y-auto">
              <Sheet.Header title="Import Preview" />
              {preview && <ImportList rows={preview} onSuccess={onSuccess} />}
              {errors && (
                <>
                  <p>Something went wrong:</p>
                  <p>{JSON.stringify(errors, null, 2)}</p>
                </>
              )}
            </Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
      )}
    </Form>
  )
}
