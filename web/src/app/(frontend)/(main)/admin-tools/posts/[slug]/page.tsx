import { notFound } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { PostForm } from 'src/components/posts/form'
import { slugPage } from 'src/components/types'
import { fetchPost } from 'src/core/services/posts/fetch-post'
import { call } from 'src/utils/service'

export default slugPage<'/admin/posts/[slug]'>(async function EditPost(slug) {
  const { data: post } = await call(fetchPost, { slug })
  if (!post) notFound()

  return (
    <>
      <AccountHeader title="Edit Post" />
      <PostForm post={post} />
    </>
  )
})
