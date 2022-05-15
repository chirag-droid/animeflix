import { GraphQLClient } from 'graphql-request';

import { aniListEndpoint, kitsuEndpoint } from 'src/constants';
import { getSdk as aniSdk } from 'src/generated/aniList';
import { getSdk as kitsuSdk, EpisodesListFragment } from 'src/generated/kitsu';

const aniListClient = new GraphQLClient(aniListEndpoint, {
  headers: {},
});

const kitsuClient = new GraphQLClient(kitsuEndpoint, {
  headers: {},
});

export const {
  indexPage,
  animePage,
  getList,
  searchAnime,
  getAnimeInfo,
  getPopularBanner,
  getAnimeBanner,
  getAnimeTitle,
  searchGenre,
  watchPage,
} = aniSdk(aniListClient);

export const { getAnimesKitsu, getEpisodeKitsu } = kitsuSdk(kitsuClient);

/**
 * @example 'naruto', startDate: '2019', season: 'WINTER'
 */
export const getKitsuEpisodes = async (
  title: string,
  season: string,
  startDate: number
): Promise<EpisodesListFragment | null> => {
  const kitsuAnimes = await getAnimesKitsu({
    title,
    first: 8,
  });

  const kitsuAnime = kitsuAnimes.data?.searchAnimeByTitle.animes.filter((r) => {
    if (!r) return false;
    if (r.season !== season) return false;

    return r.startDate.trim().split('-')[0] === startDate.toString();
  })[0];

  return kitsuAnime;
};
