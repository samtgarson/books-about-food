'use client'

import { Root } from '@radix-ui/react-accordion'
import { ChangeEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from 'src/components/atoms/button'
import * as Sheet from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { Pagination } from 'src/components/lists/pagination'
import { Search } from 'src/components/lists/search'
import { ResultRow } from 'src/services/import/import-books/types'
import { AppErrorJSON } from 'src/services/utils/errors'
import { parseCsv, process } from './action'
import { ImportFormRow } from './row'

export function ImportForm() {
  const [preview, setPreview] = useState<ResultRow[]>()
  const [errors, setErrors] = useState<AppErrorJSON[]>()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const perPage = 10

  const filtered = useMemo(() => {
    return !search.length
      ? preview
      : preview?.filter((result) => {
          return result.bookAttrs.title
            .toLowerCase()
            .includes(search.toLowerCase())
        })
  }, [preview, search])

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

  async function importBooks() {
    setProcessing(true)
    const selectedBooks = preview?.filter((result) => selected.has(result.id))
    if (!selectedBooks?.length) return
    const result = await process({ books: selectedBooks })
    if (!result.success) {
      toast.error('Something went wrong', {
        description: result.errors[0].message
      })
    } else {
      const description = (
        <>
          View {result.data === 1 ? 'it' : 'them'} in the <em>Submissions</em>{' '}
          tab
        </>
      )

      toast(
        `Successfully imported ${result.data} ${
          result.data === 1 ? 'book' : 'books'
        }`,
        { description }
      )
      setPreview(
        (preview) => preview?.filter((result) => !selected.has(result.id))
      )
      setSelected(new Set())
    }
    setProcessing(false)
  }

  function toggleSelectAll(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const newIds = filtered?.map((result) => result.id) ?? []
      setSelected((s) => new Set([...Array.from(s), ...newIds]))
    } else {
      setSelected(new Set())
    }
  }

  function toggleRow(id: string, selected: boolean) {
    selected
      ? setSelected((selected) => new Set(selected).add(id))
      : setSelected(
          (selected) => new Set(Array.from(selected).filter((s) => s !== id))
        )
  }

  return (
    <Form action={processCSV}>
      <h3 className="text-16 font-medium">Import Books</h3>
      <Input required label="CSV" name="file" type="file" accept=".csv" />
      <Submit variant="dark">Preview</Submit>
      {(filtered || errors) && (
        <Sheet.Root defaultOpen onClose={() => setPreview(undefined)}>
          <Sheet.Content size="xl">
            <Sheet.Body className="flex flex-col overflow-y-auto">
              <Sheet.Header title="Import Preview" />
              {filtered && (
                <>
                  <Pagination
                    total={filtered?.length ?? 0}
                    page={page}
                    onPageClick={setPage}
                    perPage={perPage}
                  >
                    <div className="flex gap-4 items-center mb-4 w-full">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered?.length}
                        title="Select All"
                        onChange={toggleSelectAll}
                      />
                      <Search
                        className="grow"
                        placeholder="Search"
                        onReset={() => setSearch('')}
                        onChange={async (val) => {
                          setPage(0)
                          setSearch(val)
                        }}
                        value={search}
                      />
                    </div>
                    <Root type="single" collapsible>
                      {filtered
                        .slice(page * perPage, page * perPage + perPage)
                        .map((result) => (
                          <ImportFormRow
                            result={result}
                            key={result.id}
                            selected={selected.has(result.id)}
                            setSelected={(selected) =>
                              toggleRow(result.id, selected)
                            }
                          />
                        ))}
                    </Root>
                  </Pagination>
                  <Button
                    className="mt-8"
                    variant="dark"
                    disabled={!selected.size}
                    loading={processing}
                    onClick={importBooks}
                  >
                    Import {selected.size}{' '}
                    {selected.size === 1 ? 'book' : 'books'}
                  </Button>
                </>
              )}
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
