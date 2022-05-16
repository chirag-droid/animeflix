import {
  scrapeMP4,
  scrapeSearch,
  scrapeAnimeDetails,
} from 'gogoanime-api/lib/anime_parser';
import { AnimeList, GogoEpisode } from 'gogoanime-api/lib/types';

import { getAnimeTitle } from '@lib/api';

export async function getAnimeSlug(title: string, episode: number) {
  if (!title || title === '') return {};

  const slug = title.replace(/[^0-9a-zA-Z]+/g, ' ');

  const findAnime = (await scrapeSearch({ keyw: slug })) as AnimeList[];

  if (findAnime.length === 0) return {};

  const gogoEpisodes = (await scrapeAnimeDetails({ id: findAnime[0].animeId }))
    .episodesList as GogoEpisode[];

  const episodeSlug = gogoEpisodes[0]?.episodeId.split('-episode')[0];

  const data = await scrapeMP4({
    id: `${episodeSlug}-episode-${episode}`,
  });

  const bestQuality = data.sources?.[data.sources.length - 1].file;

  return {
    referer: data.Referer || null,
    videoLink: bestQuality || null,
    episodes: gogoEpisodes.length || null,
  };
}

export async function getAnime(id: number, episode: number) {
  const { english, romaji } = (await getAnimeTitle({ id })).Media.title;

  const romajiAnime = getAnimeSlug(romaji, episode);
  const englishAnime = getAnimeSlug(english, episode);

  const anime = await Promise.all([romajiAnime, englishAnime]).then(
    (r) => r[0] || r[1]
  );

  return anime;
}
