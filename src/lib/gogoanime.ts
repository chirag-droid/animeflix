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

  // fetch animes dub and sub
  const subAnime = scrapeMP4({ id: `${episodeSlug}-episode-${episode}` });
  const dubAnime = scrapeMP4({
    id: `${episodeSlug.replace(/-movie$/, '')}-dub-episode-${episode}`,
  });

  const [sub, dub] = await Promise.all([subAnime, dubAnime]);

  sub.sources = sub.sources || [];
  sub.sources_bk = sub.sources_bk || [];
  dub.sources = dub.sources || [];
  dub.sources_bk = dub.sources_bk || [];

  return {
    sub: {
      Referer: sub.Referer,
      sources: [...sub.sources, ...sub.sources_bk],
    },
    dub: {
      Referer: dub.Referer,
      sources: [...dub.sources, ...dub.sources_bk],
    },
    episodes: gogoEpisodes.length || null,
  };
}

export async function getAnime(id: number, episode: number) {
  let { english, romaji } = (await getAnimeTitle({ id })).Media.title;

  english = english.toLocaleLowerCase();
  romaji = romaji.toLocaleLowerCase();

  if (english === romaji) {
    return getAnimeSlug(english, episode);
  }

  const romajiAnime = getAnimeSlug(romaji, episode);
  const englishAnime = getAnimeSlug(english, episode);

  const anime = await Promise.all([englishAnime, romajiAnime]).then((r) =>
    Object.keys(r[0]).length > 0 ? r[0] : r[1]
  );

  return anime;
}
