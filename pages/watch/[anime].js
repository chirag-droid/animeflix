import Header from "@components/Header"
import { progress } from "@pages/_app"
import client from "@utility/client"
import getAnime from "@utility/gogoanime"
import { slugify } from "@utility/utils"

import dynamic from 'next/dynamic'
const VideoPlayer = dynamic(() => import("@components/VideoPlayer"), { ssr: false })

function Video({ videoLink, poster }) {
  progress.finish()
  const errMessage = "The requested anime couldn't be found"

  return (
    <>
      <Header />

      <div className='max-w-[800px] mt-4 mx-auto sm:p-4 lg:p-0 lg:ml-4 lg:mx-0 lg:max-w-full lg:w-[65%]'>
        {videoLink ?
          <VideoPlayer src={videoLink} poster={poster} />
          :
          <p className='font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
            {errMessage}
          </p>
        }
      </div>
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

  let videoLink = (
    await getAnime(slugify(romaji), episode) ||
    await getAnime(slugify(english), episode)
  )

  videoLink = videoLink ? `/api/video/${videoLink.replace("https://", "")}` : null

  return {
    props: {
      videoLink,
      poster: data.anime.bannerImage
    }
  }
}

export default Video
