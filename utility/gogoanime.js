import { gogoEndpoint } from "../constants"

const options = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
  }
}

const getAnime = async (slug, episode) => {
  // Get the response from the gogoanime site
  const res = await fetch(`${gogoEndpoint}/${slug}-episode-${episode}`, options)

  // If the response is not 200 return err
  if (res.status !== 200) {
    return
  }

  // get the page soup
  const soup = await res.text()

  try {
    return await getVideoLink(getEmbedLink(soup))
  } catch(e) {
    return
  }
}

const getEmbedLink = soup => {
  let embedLink = soup.match(`.*<a href="#" rel="100" data-video=".*`)[0].trim()
  embedLink = embedLink.replace(`<a href="#" rel="100" data-video="`, "https:")
  embedLink = embedLink.substr(0, embedLink.search(`"`))

  return embedLink
}

const getVideoLink = async(embedLink) => {
  const res = await fetch(embedLink, options)

  if (res.status !== 200) {
    return
  }

  const soup = await res.text()

  let videoLink = soup.match("\s*sources.*")[0].trim()
  videoLink = videoLink.substring(videoLink.search("https"), videoLink.search("',"))

  return videoLink
}

export default getAnime
