/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, Suspense } from 'react'
import { Service } from 'src/utils/service'
import { Container } from '../atoms/container'
import { PageProps } from '../types'
import { z } from 'zod'

export type IndexPageProps<Svc extends Service<any, any>> = {
  content: ComponentType<{ filters: z.infer<Svc['input']> }>
  filters?: ComponentType<{ filters: z.infer<Svc['input']> }>
  loading?: ComponentType
  svc: Svc
}

export const createIndexPage = <Svc extends Service<any, any>>({
  content: Content,
  filters: Filters,
  loading: Loading,
  svc
}: IndexPageProps<Svc>) => {
  const IndexPage = ({ searchParams }: PageProps) => {
    const filters = svc.input.parse(searchParams)
    return (
      <Container belowNav>
        {Filters && <Filters filters={filters} />}
        <Suspense fallback={Loading ? <Loading /> : null}>
          <Content filters={filters} />
        </Suspense>
      </Container>
    )
  }
  return IndexPage
}
