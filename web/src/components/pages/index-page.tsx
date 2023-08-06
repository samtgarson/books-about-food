/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ReactNode } from 'react'
import { Service } from 'src/utils/service'
import { Container } from '../atoms/container'
import { ObjectSuspense } from '../atoms/object-suspense'
import { PageProps } from '../types'
import { z } from 'zod'

export type IndexPageProps<Svc extends Service<any, any>> = {
  content: ComponentType<{ filters: z.infer<Svc['input']> }>
  loading?: ReactNode
  svc: Svc
}

export const createIndexPage = <Svc extends Service<any, any>>({
  content: Content,
  svc,
  loading
}: IndexPageProps<Svc>) => {
  const IndexPage = ({ searchParams }: PageProps) => {
    const filters = svc.input.parse(searchParams)
    return (
      <ObjectSuspense obj={filters} fallback={loading}>
        <Container belowNav>
          <Content filters={filters} />
        </Container>
      </ObjectSuspense>
    )
  }
  return IndexPage
}
