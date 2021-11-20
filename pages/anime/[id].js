import { EmojiSadIcon } from "@heroicons/react/solid";
import { progress } from "@pages/_app";
import Banner from "@components/anime/Banner"
import Header from "@components/Header"
import Section from "@components/anime/Section"
import { animeBannerFragment, animeInfoFragment } from "@utility/fragments";
import client from "@utility/client";

function Anime({ anime, recommended }) {
  return (
    <>
      <Header />
      <Banner anime={anime} onLoadingComplete={progress.finish} />

      {recommended.length > 0 ?
        <Section animeList={recommended} title="Recommended" />
        :
        <p className='flex items-center justify-center font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
          no recommendations found
          <EmojiSadIcon className='w-8' />
        </p>
      }
    </>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params

  const query = `
  {
    Media(id: ${id}, type: ANIME) {
      ...animeBannerFragment
    }

    recommended: Page(perPage: 8) {
      recommendations(mediaId: ${id}, sort: RATING_DESC) {
        mediaRecommendation {
        ...animeInfoFragment
        }
      }
    }
  }

  ${animeBannerFragment}
  ${animeInfoFragment}
  `

  const data = await client.request(query)

  if (!data.Media) {
    return {
      notFound: true
    }
  }

  const recommended = data.recommended.recommendations.map(anime => anime.mediaRecommendation)

  return {
    props: {
      anime: data.Media,
      recommended
    }
  }
}

export default Anime
