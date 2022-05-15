import { ClientError, GraphQLClient } from 'graphql-request';

import { aniListEndpoint, kitsuEndpoint } from 'src/constants';
import { getSdk as aniSdk } from 'src/generated/aniList';
import {
  getSdk as kitsuSdk,
  EpisodesListFragment,
  SdkFunctionWrapper,
} from 'src/generated/kitsu';

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
  getAnimeByIds,
} = aniSdk(aniListClient);

// kitsu middleware to ignore error fields
const kitsuMiddleware: SdkFunctionWrapper = async (action) => {
  let result: any = {};

  try {
    result = await action();
  } catch (err) {
    if (!(err instanceof ClientError)) throw err;

    result = err.response.data;
  }

  return result;
};

export const { getAnimesKitsu, getEpisodeKitsu } = kitsuSdk(
  kitsuClient,
  kitsuMiddleware
);

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

  let kitsuAnime = kitsuAnimes.searchAnimeByTitle.animes.filter((r) => {
    if (!r) return false;
    if (r.season !== season) return false;

    return r.startDate.trim().split('-')[0] === startDate.toString();
  })[0];

  if (kitsuAnime === undefined) {
    kitsuAnime = {
      id: '-1',
      episodeCount: 0,
      episodes: {
        nodes: [],
      },
    };
  }

  if (kitsuAnime.episodeCount === null) {
    kitsuAnime.episodeCount = kitsuAnime.episodes.nodes.length;
  }

  return kitsuAnime;
};
