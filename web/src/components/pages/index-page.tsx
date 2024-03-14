import { ComponentType } from 'react'
import { z } from 'zod'
import { Container } from '../atoms/container'
import { ObjectSuspense } from '../atoms/object-suspense'
import { PageProps } from '../types'

export type IndexPageProps<Input extends z.ZodTypeAny> = {
  content: ComponentType<{ filters: z.infer<Input> }>
  filters?: ComponentType<{ filters: z.infer<Input> }>
  loading?: ComponentType
  schema: Input
}

export const createIndexPage = <Input extends z.ZodTypeAny>({
  content: Content,
  filters: Filters,
  loading: Loading,
  schema
}: IndexPageProps<Input>) => {
  const IndexPage = ({ searchParams }: PageProps) => {
    const filters = schema.parse(searchParams)

    return (
      <Container belowNav>
        {Filters && <Filters filters={filters} />}
        <ObjectSuspense fallback={Loading ? <Loading /> : null} obj={filters}>
          <Content filters={filters} />
        </ObjectSuspense>
      </Container>
    )
  }

  return IndexPage
}
