import Header from "../components/Header"
import Banner from "../components/anime/Banner"
import Section from "@components/anime/Section"
import { progress } from "@pages/_app"
import { animeBannerFragment, animeInfoFragment } from "@utility/fragments"
import client from "@utility/client"

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
      ...animeBannerFragment
    }

    trending: Page(perPage: 8) {
      media(sort: TRENDING_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }

    popular: Page(perPage: 8) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }

    topRated: Page(perPage: 8) {
      media(sort: SCORE_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }
  }

  ${animeBannerFragment}
  ${animeInfoFragment}
  `

  const data = await client.request(query)

  return {
    props: {
      banner: data.banner,
      trending: data.trending.media,
      popular: data.popular.media,
      topRated: data.topRated.media
    }
  }
}