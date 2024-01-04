'use client'

import { NamedColor } from '@books-about-food/core/services/books/colors'
import cn from 'classnames'
import Link from 'next/link'
import { useRef } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { ParamLink } from '../atoms/param-link'
import { Pill } from '../atoms/pill'

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
          {Object.entries(colorMap).map(([key, hex]) => (
            <ParamLink key={key} color={key}>
              <Link
                href=""
                onClick={() => sheet.current?.setOpen(false)}
                style={{ backgroundColor: hex }}
                className={cn(
                  'rounded-full size-12',
                  hex === '#ffffff' && 'border-neutral-grey border'
                )}
              />
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

const colorMap: Record<NamedColor, string> = {
  [NamedColor.white]: '#ffffff',
  [NamedColor.yellow]: '#EED169',
  [NamedColor.orange]: '#DF864E',
  [NamedColor.red]: '#D94F41',
  [NamedColor.pink]: '#DC73C4',
  [NamedColor.purple]: '#823DE7',
  [NamedColor.blue]: '#5C89EF',
  [NamedColor.cyan]: '#86D2B9',
  [NamedColor.lime]: '#BAF37B',
  [NamedColor.green]: '#65A34E',
  [NamedColor.brown]: '#A3602F',
  [NamedColor.gray]: '#A9ADB2',
  [NamedColor.black]: '#000000'
}

const rainbowGradient = `linear-gradient(rgb(84,166,236), rgb(84,166,236) 16%, rgb(155,210,94) 16%, rgb(155,210,94) 33%, rgb(246,229,98) 33%, rgb(246,229,98) 50%, rgb(239,173,92) 50%, rgb(239,173,92) 67%, rgb(237,109,93) 67%, rgb(237,109,93) 83%, rgb(146,83,146) 83%, rgb(146,83,146))`
