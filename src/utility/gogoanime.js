import {
  scrapeMP4,
  scrapeSearch,
  scrapeAnimeDetails,
} from 'gogoanime-api/lib/anime_parser';

async function getAnime(slug, episode) {
  if (!slug || slug === '') return {};

  const newSlug = slug.replace(/[^0-9a-zA-Z]+/g, ' ');

  const findAnime = await scrapeSearch({ keyw: newSlug });

  if (findAnime.length === 0) return {};

  const gogoEpisodes = (await scrapeAnimeDetails({ id: findAnime[0].animeId }))
    .episodesList;

  const episodeSlugId = gogoEpisodes[0]?.episodeId.split('-episode')[0];

  const data = await scrapeMP4({
    id: `${episodeSlugId}-episode-${episode}`,
  });

  const bestQuality = data.sources?.[data.sources.length - 1].file;

  return {
    referer: data.Referer,
    videoLink: bestQuality,
    episodes: gogoEpisodes,
  };
}

export default getAnime;
