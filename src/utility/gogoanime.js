import {
  scrapeMP4,
  scrapeSearch,
  scrapeAnimeDetails,
} from 'gogoanime-api/lib/anime_parser';

import { kitsuApiEndpoint } from '../constants';

export async function getAnime(slug, episode) {
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

/**
 * slug: string
 * startDtae: anime media.startDate.year
 * season: anime media.season
 * @example 'naruto', startDate: '2019', season: 'WINTER'
 *
 */
export async function getKitsuEpisodes(slug, startDate, season) {
  if (!slug || slug === '') return {};

  const newSlug = slug.replace(/[^0-9a-zA-Z]+/g, ' ');

  const findAnime = await scrapeSearch({ keyw: newSlug });

  if (!findAnime || findAnime.length === 0) return {};

  const episodesList = new Map();

  const anime = findAnime[0];

  const gogoEpisodes = (await scrapeAnimeDetails({ id: anime.animeId }))
    .episodesList;

  let kitsuEpisodes = await fetch(kitsuApiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        searchAnimeByTitle(first: 5, title: "${newSlug}") {
          nodes {
            id
            season
            startDate
            titles {
              localized
            }
            episodes(first: 2000) {
              nodes {
                number
                titles {
                  canonical
                }
                description
                thumbnail {
                  original {
                    url
                  }
                }
              }
            }
          }
        }
      }
      `,
    }),
  });

  kitsuEpisodes = await kitsuEpisodes.json();

  if (kitsuEpisodes?.data) {
    const { nodes } = kitsuEpisodes.data.searchAnimeByTitle;
    if (nodes) {
      nodes.forEach((node) => {
        if (
          node.season === season &&
          node.startDate.trim().split('-')[0] === startDate
        ) {
          const episodes = node.episodes.nodes;

          episodes.forEach((episode) => {
            if (episode) {
              const i = episode.number.toString().replace('"', '');
              let name = null;
              let description = null;
              let thumbnail = null;

              if (episode.titles?.canonical)
                name = episode.titles.canonical.toString().replace('"', '');
              if (episode.description?.en)
                description = episode.description.en
                  .toString()
                  .replace('"', '')
                  .replace('\\n', '\n');
              if (episode.thumbnail)
                thumbnail = episode.thumbnail.original.url
                  .toString()
                  .replace('"', '');

              episodesList.set(i, {
                episodeNum: episode.number.toString().replace('"', ''),
                title: name,
                description,
                thumbnail,
              });
            }
          });
        }
      });
    }
  }

  const newEpisodeList = [];

  if (episodesList.size !== 0 && gogoEpisodes.length !== 0) {
    gogoEpisodes.reverse();
    gogoEpisodes.forEach((gogoEp, i) => {
      const j = (i + 1).toString();
      newEpisodeList.push({
        episodeId: gogoEp.episodeId,
        episodeTitle: episodesList.get(j).title,
        episodeThumbnail: episodesList.get(j).thumbnail,
        episodeNum: gogoEp.episodeNum,
        episodeDescription: episodesList.get(j).description,
      });
    });
  }

  return newEpisodeList;
}
