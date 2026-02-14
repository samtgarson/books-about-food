export const getCurrentIndex = (
  el: HTMLElement | null,
  alignment: CarouselAlginment
) => {
  if (!el) return
  const parent = el.parentElement
  if (!parent) return
  const rect = parent.getBoundingClientRect()

  let x: number
  if (alignment === 'left') {
    const styleMap = getComputedStyle(el)
    const padding = parseInt(styleMap.getPropertyValue('padding-left'))
    x = rect.left + padding
  } else {
    x = rect.left + rect.width / 2
  }

  const y = rect.top + rect.height / 2
  const elAtPoint = document
    .elementsFromPoint(x, y)
    .find((el) => el.tagName === 'LI')

  if (!elAtPoint || !elAtPoint.parentElement) return
  return Array.from(elAtPoint.parentElement.children).indexOf(elAtPoint)
}

export const canScroll = (scroller: HTMLElement) => {
  const maxScroll = scroller.scrollWidth - scroller.clientWidth
  const left = scroller.scrollLeft > 0
  const right = scroller.scrollLeft < maxScroll
  return { left, right }
}

export type CarouselAlginment = 'left' | 'center'
