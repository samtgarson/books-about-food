import { fetchPost } from '@books-about-food/core/services/posts/fetch-post'
import { notFound } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { PostForm } from 'src/components/posts/form'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'

export default async function EditPost({
  params: { slug }
}: PageProps<{ slug: string }>) {
  const { data: post } = await call(fetchPost, { slug })
  if (!post) notFound()

  return (
    <>
      <AccountHeader title="Edit Post" />
      <PostForm post={post} />
    </>
  )
}
