import {
  ResultContribution,
  ResultRow
} from '@books-about-food/core/services/import/import-books/types'
import { pluralize, titleize } from 'inflection'
import { Item } from 'src/components/atoms/accordion'
import { Tag } from 'src/components/atoms/tag'

export function ImportFormRow({
  result,
  selected,
  setSelected
}: {
  result: ResultRow
  selected: boolean
  setSelected: (selected: boolean) => void
}) {
  const contributors = result.contributors.reduce(
    (acc, relation) => {
      if (!acc[relation.job]) acc[relation.job] = []
      acc[relation.job].push(relation)
      return acc
    },
    {} as Record<string, ResultContribution[]>
  )

  const contributorError =
    result.authors.some((a) => !!a.error) ||
    result.contributors.some((c) => !!c.error)

  return (
    <Item
      value={result.id}
      title={
        <>
          <p className="mr-auto font-medium">{result.bookAttrs.title}</p>
          {result.errors.map((error, index) => {
            switch (error) {
              case 'Existing':
                return (
                  <Tag
                    key={index}
                    color={'red'}
                    title="A book with this title already exists in the production database"
                  >
                    {error}
                  </Tag>
                )
              case 'Duplicate':
                return (
                  <Tag
                    key={index}
                    color={'purple'}
                    title="A book with this title is already included in the import"
                  >
                    {error}
                  </Tag>
                )
            }
          })}
          {contributorError && (
            <Tag color="red" title="There are errors with the contributors">
              !
            </Tag>
          )}
        </>
      }
      preChildren={
        <input
          type="checkbox"
          disabled={!!result.errors.length || contributorError}
          checked={selected}
          onChange={(e) => {
            setSelected(e.target.checked)
          }}
        />
      }
    >
      <table className="ml-7">
        <tbody>
          {Object.keys(result.bookAttrs).map((key) => {
            const val = result.bookAttrs[key as keyof typeof result.bookAttrs]
            if (!val || (Array.isArray(val) && !val.length)) return null
            return (
              <tr key={key}>
                <td className="font-medium pr-4 py-1">{titleize(key)}</td>
                <td className="py-1">{`${
                  result.bookAttrs[key as keyof typeof result.bookAttrs]
                }`}</td>
              </tr>
            )
          })}
          {result.authors.map((author, i) => (
            <tr key={`author-${i}`}>
              {i === 0 && (
                <td
                  rowSpan={result.authors.length}
                  className="font-medium pr-4 align-top py-1"
                >
                  {result.authors.length > 1 ? 'Authors' : 'Author'}
                </td>
              )}
              <td className="py-1 flex gap-2">
                {author.name}
                {!author.id && <Tag color="lime">New</Tag>}
                {author.error === 'MultipleMatches' && (
                  <Tag color="red">Multiple matches</Tag>
                )}
              </td>
            </tr>
          ))}
          {Object.entries(contributors).flatMap(([job, contributors]) =>
            contributors.map((relation, i) => (
              <tr key={`${job}-${i}`}>
                {i === 0 && (
                  <td
                    rowSpan={contributors.length}
                    className="font-medium pr-4 align-top py-1"
                  >
                    {contributors.length > 1
                      ? pluralize(titleize(job))
                      : titleize(job)}
                  </td>
                )}
                <td className="py-1 flex gap-2">
                  {relation.name}
                  {!relation.id && <Tag color="lime">New</Tag>}
                  {relation.error === 'MultipleMatches' && (
                    <Tag
                      color="red"
                      title="We found multiple profiles with this name"
                    >
                      Multiple matches
                    </Tag>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Item>
  )
}
