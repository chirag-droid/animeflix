export default async function handler(req, res) {
  const { proxy } = req.query
  const url = `https://${proxy.join("/")}`

  const options = {
    headers: {
      'Referer': 'https://gogoplay1.com/'
    }
  }

  // fetch the data from the url
  const response = await fetch(url, options)

  const setHeader = header => {
    res.setHeader(header, response.headers.get(header.toLowerCase()))
  }

  // set etag, and expires header so that the browser caches the video data
  setHeader("etag")
  setHeader("expires")

  // send the response data back to the client
  res.send(response.body)
}
