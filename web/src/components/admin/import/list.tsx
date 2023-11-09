import { Root } from '@radix-ui/react-accordion'
import { ResultRow } from 'core/services/import/import-books/types'
import { ChangeEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from 'src/components/atoms/button'
import { Pagination } from 'src/components/lists/pagination'
import { Search } from 'src/components/lists/search'
import { process } from './action'
import { ImportFormRow } from './row'

export function ImportList({
  rows,
  onSuccess
}: {
  rows: ResultRow[]
  onSuccess: (ids: Set<string>) => void
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const [processing, setProcessing] = useState(false)

  const perPage = 10

  const filtered = useMemo(() => {
    return !search.length
      ? rows
      : rows?.filter((result) => {
          return result.bookAttrs.title
            .toLowerCase()
            .includes(search.toLowerCase())
        })
  }, [rows, search])

  async function importBooks() {
    setProcessing(true)
    const selectedBooks = rows?.filter((result) => selected.has(result.id))
    if (!selectedBooks?.length) return
    const result = await process({ books: selectedBooks })
    if (!result.success || result.data.length === 0) {
      toast.error('Something went wrong', {
        description: result.errors?.[0].message
      })
    } else {
      const count = result.data.length
      const description = (
        <>
          View {count === 1 ? 'it' : 'them'} in the <em>Submissions</em> tab
        </>
      )

      toast(
        `Successfully imported ${count} ${count === 1 ? 'book' : 'books'}`,
        { description }
      )
      onSuccess(new Set(result.data))
      setSelected(
        (selected) =>
          new Set(Array.from(selected).filter((s) => !result.data.includes(s)))
      )
    }
    setProcessing(false)
  }

  function toggleSelectAll(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const newIds =
        filtered?.flatMap((result) => {
          if (result.errors?.length) return []
          return result.id
        }) ?? []
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
                setSelected={(selected) => toggleRow(result.id, selected)}
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
        Import {selected.size} {selected.size === 1 ? 'book' : 'books'}
      </Button>
    </>
  )
}
