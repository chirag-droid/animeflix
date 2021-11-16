import Banner from "../../components/anime/Banner"
import Header from "../../components/Header"
import Section from "../../components/anime/Section"
import { EmojiSadIcon } from "@heroicons/react/solid";
import { progress } from "../_app";

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

    recommended: Page(perPage: 8) {
      recommendations(mediaId: ${id}, sort: RATING_DESC) {
        mediaRecommendation {
        ...anime
        }
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
      medium
      color
    }
    meanScore
    genres
    episodes
    duration
    studios(isMain: true) {
      nodes {
        name
      }
    }
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
  
  if(!response.data.Media) {
    return {
      notFound: true
    }
  }

  const recommended = response.data.recommended.recommendations.map(anime => anime.mediaRecommendation)

  return {
    props: {
      anime: response.data.Media,
      recommended
    }
  }
}

export default Anime