import { scrapeMP4, scrapeSearch } from "gogoanime-api/lib/anime_parser";
const cheerio = require("cheerio");

const options = {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
  },
};

const options2 = {
  headers: {
    "x-requested-with": "XMLHttpRequest",
  },
};

async function getAnime(slug, episode) {
  if (slug == "") return;
  const findAnime = await scrapeSearch({ keyw: slug });
  const data = await scrapeMP4({ id: `${findAnime[0].animeId}-episode-${episode}` });

  const bestQuality = data.sources?.[data.sources.length - 1].file;

  return {
    referrer: data.Referer,
    videoLink: bestQuality,
  };
}

export default getAnime;
