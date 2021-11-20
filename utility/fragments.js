export const animeInfoFragment = `
  fragment animeInfoFragment on Media {
    id
    title {
      english
      romaji
    }
    coverImage {
      color
      medium
      large
    }
    format
    duration
    meanScore
  }
`

export const animeBannerFragment = `
  fragment animeBannerFragment on Media {
    id
    title {
      english
      romaji
    }
    bannerImage
    description
    format
    duration
    meanScore
    genres
  }
`
