import Header from "../components/Header"
import Banner from "../components/anime/Banner"
import Section from "../components/anime/Section"
import { progress } from "./_app"

export default function Home({ banner, trending, popular, topRated }) {
  return (
    <>
    <Header />

    <Banner anime={banner} onLoadingComplete={progress.finish} />

    <Section title="Trending Now" animeList={trending} />
    <Section title="Popular" animeList={popular} />
    <Section title="Top Rated (All time)" animeList={topRated} />

    <div className='w-full h-8 text-white flex justify-center bg-gray-900 items-center font-bold'>
      <p>Created by <a href='https://github.com/chirag-droid'>Chirag Singla</a></p>
    </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const query = `
  {
    banner: Media(type: ANIME, sort: POPULARITY_DESC, seasonYear: ${new Date().getFullYear()}) {
      id
      bannerImage
      title {
        english
        romaji
      }
      duration
      description
      genres
      format
      meanScore
    }

    trending: Page(perPage: 8) {
      media(sort: TRENDING_DESC, type: ANIME) {
        ...anime
      }
    }

    popular: Page(perPage: 8) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        ...anime
      }
    }

    topRated: Page(perPage: 8) {
      media(sort: SCORE_DESC, type: ANIME) {
        ...anime
      }
    }
  }

  fragment anime on Media {
    id
    title {
      romaji
      english
    }
    coverImage {
      large
      color
    }
    meanScore
    genres
    episodes
    duration
    format
  }
  `

  const url = 'https://graphql.anilist.co'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: query
    })
  }

  const response = await (await fetch(url, options)).json()

  return {
    props: {
      banner: response.data.banner,
      trending: response.data.trending.media,
      popular: response.data.popular.media,
      topRated: response.data.topRated.media
    }
  }
}