import { scrapeMP4, scrapeSearch } from 'gogoanime-api/lib/anime_parser';

async function getAnime(slug, episode) {
  const newSlug = slug.replace(/[^0-9a-zA-Z]+/g, ' ');

  if (newSlug === '') return {};
  const findAnime = await scrapeSearch({ keyw: newSlug });

  if (findAnime.length === 0) return {};

  const data = await scrapeMP4({
    id: `${findAnime[0].animeId}-episode-${episode}`,
  });

  const bestQuality = data.sources?.[data.sources.length - 1].file;

  return {
    referrer: data.Referer,
    videoLink: bestQuality,
  };
}

export default getAnime;
