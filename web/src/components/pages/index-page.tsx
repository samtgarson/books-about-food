import { ComponentType, Fragment } from 'react'
import { z } from 'zod'
import { Container } from '../atoms/container'
import { ObjectSuspense } from '../atoms/object-suspense'
import { ListContainer } from '../lists/list-context'
import { PageProps } from '../types'

export type IndexPageProps<Input extends z.ZodTypeAny> = {
  components: {
    content: ComponentType<{ filters: z.infer<Input> }>
    filters?: ComponentType<{ filters: z.infer<Input> }>
    loading?: ComponentType
  }
  schema: Input
  config?: {
    wrapInListContext?: boolean
  }
}

export const createIndexPage = <Input extends z.ZodTypeAny>({
  components: { content: Content, filters: Filters, loading: Loading },
  schema,
  config: { wrapInListContext } = { wrapInListContext: false }
}: IndexPageProps<Input>) => {
  const IndexPage = ({ searchParams }: PageProps) => {
    const filters = schema.parse(searchParams)
    const ListContext = wrapInListContext ? ListContainer : Fragment

    return (
      <Container belowNav>
        <ListContext>
          {Filters && <Filters filters={filters} />}
          <ObjectSuspense fallback={Loading ? <Loading /> : null} obj={filters}>
            <Content filters={filters} />
          </ObjectSuspense>
        </ListContext>
      </Container>
    )
  }

  return IndexPage
}
