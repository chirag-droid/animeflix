import Header from "@components/Header"
import { progress } from "@pages/_app"
import client from "@utility/client"
import getAnime from "@utility/gogoanime"

import dynamic from 'next/dynamic'
const VideoPlayer = dynamic(() => import("@components/VideoPlayer"), { ssr: false })

function Video({ videoLink, poster }) {
  progress.finish()
  const errMessage = "The requested anime couldn't be found"

  return (
    <>
      <Header />

      {videoLink ?
        <VideoPlayer src={videoLink} poster={poster} />
        :
        <p className='font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
          {errMessage}
        </p>
      }
    </>
  )
}

export async function getServerSideProps(context) {
  const { anime, episode } = context.query

  const query = `
  {
    anime: Media(id: ${anime}) {
      title {
        english
        romaji
      }
      bannerImage
    }
  }
  `

  const data = await client.request(query)
  const { english, romaji } = data.anime.title

  const slug = (romaji || english).replace(/[^\w-]/g, " ").split(/ +/).join("-")

  const videoLink = await getAnime(slug, episode)

  return {
    props: {
      videoLink: `/api/video/${videoLink.replace("https://", "")}`,
      poster: data.anime.bannerImage
    }
  }
}

export default Video
