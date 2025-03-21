import { Slider as RSlider } from 'radix-ui'
import { forwardRef } from 'react'

export const Slider = forwardRef<HTMLSpanElement, RSlider.SliderProps>(
  function Slider(props, ref) {
    return (
      <RSlider.Root
        {...props}
        ref={ref}
        className="relative flex items-center select-none touch-none w-full"
      >
        <RSlider.Track className="flex-grow bg-khaki h-0.5 relative">
          <RSlider.Range className="absolute bg-black/80 h-full" />
        </RSlider.Track>
        <RSlider.Thumb className="block size-5 bg-black shadow rounded-full" />
      </RSlider.Root>
    )
  }
)
