import {
  scrapeMP4,
  scrapeSearch,
  scrapeAnimeDetails,
} from 'gogoanime-api/lib/anime_parser';

import client from '@utility/client';

import { kitsuApiEndpoint } from '../constants';

export async function getTitle(id) {
  const query = `
  {
    anime: Media(id: ${id}) {
      title {
        english
        romaji
      }
    }
  }
  `;

  const data = await client.request(query);

  return data.anime.title;
}

export async function getAnimeSlug(title, episode) {
  if (!title || title === '') return {};

  const slug = title.replace(/[^0-9a-zA-Z]+/g, ' ');

  const findAnime = await scrapeSearch({ keyw: slug });

  if (findAnime.length === 0) return {};

  const gogoEpisodes = (await scrapeAnimeDetails({ id: findAnime[0].animeId }))
    .episodesList;

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

export async function getAnime(id, episode) {
  const { english, romaji } = await getTitle(id);

  const romajiAnime = getAnimeSlug(romaji, episode);
  const englishAnime = getAnimeSlug(english, episode);

  const anime = await Promise.all([romajiAnime, englishAnime]).then(
    (r) => r[0] || r[1]
  );

  return anime;
}

/**
 * slug: string
 * startDtae: anime media.startDate.year
 * season: anime media.season
 * @example 'naruto', startDate: '2019', season: 'WINTER'
 *
 */
export async function getKitsuEpisodes(title, startDate, season) {
  if (!title || title === '') return {};

  const slug = title.replace(/[^0-9a-zA-Z]+/g, ' ');

  let kitsuEpisodes = await fetch(kitsuApiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        searchAnimeByTitle(first: 5, title: "${slug}") {
          nodes {
            id
            season
            startDate
            titles {
              localized
            }
            episodes(first: 8) {
              nodes {
                number
                titles {
                  canonical
                }
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

  let episodes = [];

  if (kitsuEpisodes?.data) {
    const { nodes } = kitsuEpisodes.data.searchAnimeByTitle;
    if (nodes) {
      nodes.forEach((node) => {
        if (
          node.season === season &&
          node.startDate.trim().split('-')[0] === startDate.toString()
        ) {
          episodes = node.episodes.nodes;
        }
      });
    }
  }

  return episodes;
}
