export const slugify = text => {
  if (!text)
    return ''
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}