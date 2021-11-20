export default async function handler(req, res) {
  const { proxy } = req.query
  const url = `https://${proxy.join("/")}`

  const options = {
    headers: {
      'Referer': 'https://gogoplay1.com/'
    }
  }

  const response = await fetch(url, options)
  res.send(response.body)
}
