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
              className="size-6 -my-2 -ml-2 rounded-full"
            ></span>
          )}
          Colours
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body
          title="Colours"
          className="grid grid-cols-[repeat(7,_48px)] gap-4 justify-center"
          controls={
            <ParamLink color={null} sort={null}>
              <Link
                scroll={false}
                href=""
                className="text-14 bg-transparent"
                onClick={() => sheet.current?.setOpen(false)}
              >
                Reset
              </Link>
            </ParamLink>
          }
        >
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
              className={cn('rounded-full size-12')}
            />
          </ParamLink>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
