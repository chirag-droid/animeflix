import { ClientError, GraphQLClient } from 'graphql-request';

import { aniListEndpoint, kitsuEndpoint } from './constants';
import { getSdk as aniSdk } from './generated/aniList';
import {
  getSdk as kitsuSdk,
  EpisodesListFragment,
  SdkFunctionWrapper,
} from './generated/kitsu';

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
  title: string | null,
  season: string,
  startDate: number
): Promise<EpisodesListFragment | null> => {
  if (!title) {
    return {
      episodeCount: 0,
      episodes: {
        nodes: [],
      },
    };
  }

  const kitsuAnimes = await getAnimesKitsu({
    title,
    first: 8,
  });

  let kitsuAnime = kitsuAnimes.searchAnimeByTitle.animes.filter((r) => {
    // return if the anime doesn't exists
    if (!r) return false;

    // return false if the startDate doesn't exist
    if (!r.startDate) return false;

    // only return false if the season exists and doesn't
    // match with the kitsu one
    if (r.season !== season && season) return false;

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
