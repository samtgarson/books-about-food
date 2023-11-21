'use client'

import cn from 'classnames'
import Color from 'color'
import Link from 'next/link'
import { useRef } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { ParamLink } from '../atoms/param-link'
import { Pill } from '../atoms/pill'

export function ColorFilter({ value }: { value?: number[] }) {
  const sheet = useRef<Sheet.SheetControl>(null)

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Trigger>
        <Pill className="gap-2">
          {value && (
            <span
              style={{ backgroundColor: `rgb(${value.join(',')})` }}
              className="w-6 h-6 -my-2 -ml-2 rounded-full"
            ></span>
          )}
          Colours
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body
          title="Pick a colour"
          className="grid grid-cols-[repeat(7,_48px)] gap-4 justify-center"
          controls={
            <ParamLink color={null}>
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
          {colors.map((color) => (
            <ParamLink key={color} color={color}>
              <Link
                href=""
                onClick={() => sheet.current?.setOpen(false)}
                style={{ backgroundColor: `rgb(${color})` }}
                className={cn(
                  'rounded-full w-12 h-12',
                  color === '255,255,255' && 'border-neutral-grey border'
                )}
              />
            </ParamLink>
          ))}
          <ParamLink key="all" sort="color">
            <Link
              href=""
              onClick={() => sheet.current?.setOpen(false)}
              style={{
                background: rainbowGradient
              }}
              className={cn('rounded-full w-12 h-12')}
            />
          </ParamLink>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}

const colors = [
  '#ffffff',
  '#EED169',
  '#DF864E',
  '#D94F41',
  '#DC73C4',
  '#823DE7',
  '#5C89EF',
  '#86D2B9',
  '#BAF37B',
  '#65A34E',
  '#A3602F',
  '#A9ADB2',
  '#000000'
].map((color) => new Color(color).rgb().array().join(','))

const rainbowGradient = `linear-gradient(rgb(84,166,236), rgb(84,166,236) 16%, rgb(155,210,94) 16%, rgb(155,210,94) 33%, rgb(246,229,98) 33%, rgb(246,229,98) 50%, rgb(239,173,92) 50%, rgb(239,173,92) 67%, rgb(237,109,93) 67%, rgb(237,109,93) 83%, rgb(146,83,146) 83%, rgb(146,83,146))`
