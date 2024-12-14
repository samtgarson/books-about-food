'use client'

import { Collection } from '@books-about-food/core/models/collection'
import cn from 'classnames'
import { CSSProperties } from 'react'
import { range } from 'src/utils/array-helpers'
import { useListDisplay } from '../lists/list-context'

export function CollectionBlobs({ colors }: { colors: Collection['colors'] }) {
  const { display } = useListDisplay()
  return (
    <div
      className={cn(
        'grid sm:grid-cols-4 mobile-only:order-last mobile-only:mt-3',
        display === 'grid' ? 'grid-cols-4 !mt-auto' : 'grid-cols-6'
      )}
    >
      {range(12).map((i) => (
        <div
          key={i}
          className={cn(
            'sm:size-10 rounded-full bg-grey',
            i > 7 && display === 'grid' && 'hidden sm:block',
            display === 'grid' ? 'size-7' : 'size-8'
          )}
          style={blobStyle(colors[i])}
        />
      ))}
    </div>
  )
}

function blobStyle(color?: string): CSSProperties {
  if (!color) return {}
  return { backgroundColor: color }
}
