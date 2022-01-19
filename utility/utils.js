const cheerio = require("cheerio")

export async function slugify(text) {
  if (!text)
    return ''

  const url = `https://ajax.gogo-load.com/site/loadAjaxSearch?keyword=${text}`
  const res = await fetch(url)
  const content = JSON.parse(await res.text()).content
  // remove "/category" from slug
  const slug = cheerio.load(content)("div.list_search_ajax a").attr("href").substring(9)
  console.log(slug)
  return slug
}