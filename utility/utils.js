export const slugify = text => text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')