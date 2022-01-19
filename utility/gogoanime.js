import { gogoEndpoint } from "../constants"
const cheerio = require("cheerio")
const aesjs = require("aes-js")
const base64url = require("base64url")
const querystring = require('querystring')

const options = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
  }
}

const options2 = {
  headers: {
    'x-requested-with': 'XMLHttpRequest'
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
    console.log(e)
    return
  }
}

const getEmbedLink = soup => {
  const $ = cheerio.load(soup)
  let embedLink = "https:" + $("div.anime_muti_link > ul > li.vidcdn > a").attr("data-video")
  console.log(embedLink)

  return embedLink
}

const getVideoLink = async(embedLink) => {
  const res = await fetch(embedLink, options)

  if (res.status !== 200) {
    return
  }

  const $ = cheerio.load(await res.text())

  let encrypted = $("script[data-name='crypto']").attr("data-value")
  let iv = $("script[data-name='ts']").attr("data-value")
  let iv_bytes = aesjs.utils.utf8.toBytes(iv)
  let key_bytes = new Uint8Array([...iv_bytes, ...iv_bytes])
  let id = (new URL(embedLink)).searchParams.get("id")

  let decrypted = decrypt(encrypted, iv_bytes, key_bytes)
  var ivBytes = aesjs.utils.utf8.toBytes("0000000000000000");
  var keyBytes = aesjs.padding.pkcs7.strip(decrypted);

  let encrypted_id = encrypt(id, ivBytes, keyBytes)

  let sourcesLink = "http://gogoplay.io/encrypt-ajax.php?id=" + encrypted_id + "&time=00000000000000000000"
  var sources_result = await fetch(sourcesLink, options2)
  var sources = JSON.parse(await sources_result.text())
  console.log(sources)

  let videoLinks = sources.source
  if (videoLinks.length < 2) {
    return videoLinks[0].file
  }
  let filteredLinks = videoLinks.filter(filterVideos)
  if (filteredLinks.length == 0) {
    return videoLinks[0].file
  } else {
    return filteredLinks[0].file
  }
}

function filterVideos(src) {
  return src.label == "1080 P";
}

function encrypt(msg, ivBytes, keyBytes) {
  var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  var textBytes = aesjs.utils.utf8.toBytes(msg);
  var padded = aesjs.padding.pkcs7.pad(textBytes);
  var encryptedBytes = aesCbc.encrypt(padded);
  return base64url.encode(encryptedBytes);
}

function decrypt(encrypted, ivBytes, keyBytes) {
  var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  var encryptedBytes = base64url.toBuffer(encrypted)
  var decryptedBytes = aesCbc.decrypt(encryptedBytes);
  return decryptedBytes
}

export default getAnime
