import loader from '@books-about-food/shared/cloudflare/image-loader'
import { ImageLoaderProps } from 'next/image'

export default function cloudflareLoader(
  props: ImageLoaderProps & { format?: string }
): string {
  return loader(props)
}
