import { Slider as RSlider } from 'radix-ui'
import { forwardRef } from 'react'

export const Slider = forwardRef<HTMLSpanElement, RSlider.SliderProps>(
  function Slider(props, ref) {
    return (
      <RSlider.Root
        {...props}
        ref={ref}
        className="relative flex w-full touch-none items-center select-none"
      >
        <RSlider.Track className="relative h-0.5 grow bg-khaki">
          <RSlider.Range className="absolute h-full bg-black/80" />
        </RSlider.Track>
        <RSlider.Thumb className="block size-5 rounded-full bg-black shadow-xs" />
      </RSlider.Root>
    )
  }
)
