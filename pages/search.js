import { useRouter } from "next/router";
import Card from "@components/anime/Card";
import Header from "@components/Header";
import client from "@utility/client";
import { animeInfoFragment } from "@utility/fragments";
import { progress } from "@pages/_app";

export default function Search({ searchResults }) {
  const router = useRouter()
  const { keyword } = router.query

  progress.finish()

  return (
    <>
      <Header />

      <p className='font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
        Found {searchResults.length} results for {keyword}
      </p>

      <div className='gap-y-8 place-items-center mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {searchResults.map(anime => <Card key={anime.id} anime={anime} />)}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { keyword } = context.query

  const query = `
  {
    searchResults: Page(perPage: 50) {
      media(type: ANIME, search: "${keyword}") {
        ...animeInfoFragment
      }
    }
  }

  ${animeInfoFragment}
  `

  const data = await client.request(query)

  return {
    props: {
      searchResults: data.searchResults.media
    }
  }
}
