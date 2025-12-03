import { AppRoutes } from '.next/types/routes'
import { ComponentType, Fragment } from 'react'
import { z } from 'zod'
import { Container } from '../atoms/container'
import { ObjectSuspense } from '../atoms/object-suspense'
import { ListContainer } from '../lists/list-container'

export type IndexPageProps<Input extends z.ZodType> = {
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

export const createIndexPage = <
  Input extends z.ZodType,
  Path extends AppRoutes
>({
  components: { content: Content, filters: Filters, loading: Loading },
  schema,
  config: { wrapInListContext } = { wrapInListContext: false }
}: IndexPageProps<Input>) => {
  const IndexPage = async ({ searchParams }: PageProps<Path>) => {
    const filters = schema.parse(await searchParams)
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
