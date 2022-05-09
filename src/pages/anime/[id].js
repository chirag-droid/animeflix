import { EmojiSadIcon } from '@heroicons/react/solid';

import Banner from '@components/anime/Banner';
import EpisodeSection from '@components/anime/EpisodeSection';
import Section from '@components/anime/Section';
import Header from '@components/Header';
import { progress } from '@pages/_app';
import client from '@utility/client';
import { animeBannerFragment, animeInfoFragment } from '@utility/fragments';
import { getKitsuEpisodes } from '@utility/gogoanime';

function Anime({ anime, recommended, episodes }) {
  return (
    <>
      <Header />
      <Banner anime={anime} onLoadingComplete={progress.finish} />

      {/* Don't show episode section if format is movie */}
      {anime.format !== 'TV' ? null : (
        <>
          {episodes.length > 0 ? (
            <EpisodeSection anime={anime} episodeList={episodes} />
          ) : (
            <p className="flex items-center justify-center font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              no episodes found
              <EmojiSadIcon className="w-8" />
            </p>
          )}
        </>
      )}

      {recommended.length > 0 ? (
        <Section animeList={recommended} title="Recommended" />
      ) : (
        <p className="flex items-center justify-center font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
          no recommendations found
          <EmojiSadIcon className="w-8" />
        </p>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  const query = `
  {
    Media(id: ${id}, type: ANIME) {
      ...animeBannerFragment
      ...animeInfoFragment
    }

    recommended: Page(perPage: 8) {
      recommendations(mediaId: ${id}, sort: RATING_DESC) {
        mediaRecommendation {
        ...animeInfoFragment
        }
      }
    }
  }

  ${animeBannerFragment}
  ${animeInfoFragment}
  `;

  const data = await client.request(query);

  if (!data.Media) {
    return {
      notFound: true,
    };
  }

  const recommended = data.recommended.recommendations.map(
    (anime) => anime.mediaRecommendation
  );

  // fetch episode list
  const episodes = await getKitsuEpisodes(
    data.Media.title.romaji,
    data.Media.startDate.year,
    data.Media.season
  );

  return {
    props: {
      anime: data.Media,
      recommended,
      episodes,
    },
  };
}

export default Anime;
