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
          node.startDate.trim().split('-')[0] === startDate.toString()
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
      const ep = episodesList.get(j);
      newEpisodeList.push({
        episodeId: gogoEp.episodeId,
        episodeTitle: ep
          ? episodesList.get(j).title
          : `Episode: ${gogoEp.episodeNum}`,
        episodeThumbnail: ep ? episodesList.get(j).thumbnail : null,
        episodeNum: gogoEp.episodeNum,
        episodeDescription: ep ? episodesList.get(j).description : null,
      });
    });
  }

  return newEpisodeList;
}
