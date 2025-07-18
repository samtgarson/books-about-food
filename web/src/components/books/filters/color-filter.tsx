'use client'

import { NamedColor } from '@books-about-food/core/services/books/colors'
import cn from 'classnames'
import Link from 'next/link'
import { useRef } from 'react'
import { ParamLink } from 'src/components/atoms/param-link'
import { Pill } from 'src/components/atoms/pill'
import * as Sheet from 'src/components/atoms/sheet'
import { ColorCircle, colorMap, rainbowGradient } from './colors'

export function ColorFilter({ value }: { value?: number[] | NamedColor }) {
  const sheet = useRef<Sheet.SheetControl>(null)

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Trigger>
        <Pill className="gap-2">
          {value && (
            <span
              style={{
                backgroundColor:
                  typeof value === 'string'
                    ? colorMap[value]
                    : `hsl(${value[0]},${value[1]}%,${value[2]}%)`
              }}
              className="-my-2 -ml-2 size-6 rounded-full"
            ></span>
          )}
          Colours
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content
        title="Colors"
        controls={
          <ParamLink color={null} sort={null}>
            <Link
              scroll={false}
              href=""
              className="bg-transparent text-14"
              onClick={() => sheet.current?.setOpen(false)}
            >
              Reset
            </Link>
          </ParamLink>
        }
      >
        <Sheet.Body className="grid grid-cols-[repeat(7,48px)] justify-center gap-4">
          {Object.keys(colorMap).map((key) => (
            <ParamLink key={key} color={key}>
              <Link href="" onClick={() => sheet.current?.setOpen(false)}>
                <ColorCircle color={key} />
              </Link>
            </ParamLink>
          ))}
          <ParamLink key="all" sort="color" color={null}>
            <Link
              href=""
              onClick={() => sheet.current?.setOpen(false)}
              style={{
                background: rainbowGradient
              }}
              className={cn('size-12 rounded-full')}
            />
          </ParamLink>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
