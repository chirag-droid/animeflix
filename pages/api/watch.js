export default async function handler(req, res) {
  const { anime, episode } = req.query

  const {english, romaji, err} = await getTitle(anime)
  if (err) {
    res.status(404).json({
      notFound: true
    })
  }

  const options = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
    }
  }

  let status = await (await fetch(gogoLink(english), options)).status  
  let videoLink = ""

  if (status === 200) {
    videoLink = `${gogoLink(english).replace("category/", "")}-episode-${episode}`
  } else {
    status = await (await (fetch(gogoLink(romaji), options))).status
    if (status === 200) {
      videoLink = `${gogoLink(romaji).replace("category/", "")}-episode-${episode}`
    } else {
      return res.status(404).json({
        notFound: true
      })
    }
  }
  
  res.status(200).json({
    props: {
      videoLink: await getVideoLink(videoLink, options),
      headers: [
        "Referer https://gogoplay1.com/"
      ]
    }
  })
}

const gogoLink = (name) => {
  const ignore = [":", "(", ")"]
  name = name.split(" ").join("-").replaceAll()
  
  ignore.forEach(word => {
    name = name.replaceAll(word, "")
  });

  return `https://gogoanime.cm/category/${name}`
}

const getTitle = async(anime) => {
  const query = `
  {
    anime: Media(id: ${anime}) {
      title {
        english
        romaji
      }
    }
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

  if (!response.data.anime) {
    return {
      err: true
    }
  }

  return response.data.anime.title
}

const getVideoLink = async(pageLink, options) => {
  let soup = await (await fetch(pageLink, options)).text()

  let videoLink = soup.match(`.*<a href="#" rel="100" data-video=".*`)[0].trim()
  videoLink = videoLink.replace(`<a href="#" rel="100" data-video="`, "https:")
  videoLink = videoLink.substr(0, videoLink.search(`"`))

  soup = await (await fetch(videoLink, options)).text()

  videoLink = soup.match("\s*sources.*")[0].trim()
  videoLink = videoLink.substring(videoLink.search("https"), videoLink.search("',"))

  return videoLink
}
