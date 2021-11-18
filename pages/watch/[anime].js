import Header from "../../components/Header"
import absoluteUrl from "next-absolute-url"
import VideoPlayer from "../../components/VideoPlayer"
import { progress } from "../_app"

function Video({ videoLink, headers }) {
  progress.finish()

  return (
    <>
      <Header />
      <VideoPlayer src={videoLink} headers={headers} />
    </>
  )
}

export async function getServerSideProps(context) {
  let { anime, episode } = context.query
  episode = episode || "1"

  const { origin } = absoluteUrl(context.req)

  return await (await fetch(`${origin}/api/watch?anime=${anime}&episode=1`)).json()
}

export default Video
