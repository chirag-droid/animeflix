import { scrapeMP4, scrapeSearch } from "gogoanime-api/lib/anime_parser";

async function getAnime(slug, episode) {
  if (slug == "") return;
  const findAnime = await scrapeSearch({ keyw: slug });

  if (findAnime.length === 0) return;

  const data = await scrapeMP4({ id: `${findAnime[0].animeId}-episode-${episode}` });

  const bestQuality = data.sources?.[data.sources.length - 1].file;

  return {
    referrer: data.Referer,
    videoLink: bestQuality,
  };
}

export default getAnime;
