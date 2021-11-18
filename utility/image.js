export const toBase64 = (str) => Buffer.from(str).toString('base64')

export const solidImage = (color) => `
  <svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1" height="1" style="fill:${color};stroke-width:3;stroke:${color}" />
  </svg>
`

export const base64SolidImage = (color) => toBase64(solidImage(color))
