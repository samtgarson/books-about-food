import * as RadixSlider from '@radix-ui/react-slider'
import { SliderProps } from '@radix-ui/react-slider'
import { forwardRef } from 'react'

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  function Slider(props, ref) {
    return (
      <RadixSlider.Root
        {...props}
        ref={ref}
        className="relative flex items-center select-none touch-none w-full"
      >
        <RadixSlider.Track className="flex-grow bg-khaki h-0.5 relative">
          <RadixSlider.Range className="absolute bg-black/80 h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block size-5 bg-black shadow rounded-full" />
      </RadixSlider.Root>
    )
  }
)
