export const deHyperlinkUrl = (link: string) => {
  const cleaned = link.split(/([:?.])/).join('&#65279;')
  console.log(cleaned)
  return cleaned
}
