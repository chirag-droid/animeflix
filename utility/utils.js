const cheerio = require("cheerio")

export async function slugify(text) {
  if (!text)
    return ""

  const url = `https://ajax.gogo-load.com/site/loadAjaxSearch?keyword=${text}`
  const res = await fetch(url)
  const content = JSON.parse(await res.text()).content
  const slug = cheerio.load(content)("div.list_search_ajax a").attr("href")
  if (slug == undefined) return ""
  // remove "category/" from slug
  return slug.substring(9)
}