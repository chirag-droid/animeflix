export const slugify = text => {
  if (!text)
    return ''
  return text.toLowerCase().replace(/[^\w-]+/g, ' ').replace(/ /g, '-')
}