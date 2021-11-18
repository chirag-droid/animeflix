import { gql } from "graphql-request";

export const animeInfoFragment = gql`
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

export const animeBannerFragment = gql`
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
