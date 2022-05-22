import { useEffect, useRef } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import Genre from '@components/Genre';
import Header from '@components/Header';
import progressBar from '@components/Progress';
import RecommendationCard from '@components/watch/Card';
import Episode from '@components/watch/Episode';
import WatchControls from '@components/watch/WatchControls';
import { AnimeBannerFragment, AnimeInfoFragment } from '@generated/aniList';
import useStream from '@hooks/useStream';
import useVideoSources from '@hooks/useVideoSources';
import { watchPage } from '@lib/api';
import { proxyFreeUrls } from '@lib/constants';
import { convertToDate, convertToTime } from '@utility/time';
import { arrayToString } from '@utility/utils';

const VideoPlayer = dynamic(() => import('@components/watch/VideoPlayer'), {
  ssr: false,
});

interface WatchProps {
  anime: AnimeInfoFragment & AnimeBannerFragment;
  recommended: (AnimeInfoFragment & AnimeBannerFragment)[];
}

export const getServerSideProps: GetServerSideProps<WatchProps> = async (
  context
) => {
  const { id } = context.params;

  const data = await watchPage({
    id: parseInt(arrayToString(id), 10),
    perPage: 20,
  });

  const recommended = data.recommended.recommendations.map(
    (anime) => anime.mediaRecommendation
  );

  return {
    props: {
      anime: data.anime,
      recommended,
    },
  };
};

const Watch = ({
  anime,
  recommended,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // finish the progress bar
  progressBar.finish();

  const router = useRouter();
  const { query } = router;

  // get the stream store
  const [episode, setEpisode] = useStream((store) => [
    store.episode,
    store.setEpisode,
  ]);
  const setAnimeId = useStream((store) => store.setAnimeId);
  const [shouldUseProxy, setProxy] = useStream((store) => [
    store.shouldUseProxy,
    store.setProxy,
  ]);
  const isDub = useStream((store) => store.isDub);
  const [totalEpisodes, setTotalEpisodes] = useStream((store) => [
    store.totalEpisodes,
    store.setTotalEpisode,
  ]);

  // get the videolink, episode of the anime
  const { sources, referer, isError, isLoading, episodes } = useVideoSources(
    anime.id,
    episode,
    isDub
  );

  // set the total episodes the animes has
  useEffect(() => {
    setTotalEpisodes(episodes);
  }, [episodes, setTotalEpisodes]);

  // set the current anime
  useEffect(() => {
    setAnimeId(parseInt(arrayToString(query.id), 10));
  }, [query.id, setAnimeId]);

  // set the current playing episode from the query
  useEffect(() => {
    if (query.episode) {
      setEpisode(parseInt(arrayToString(query.episode), 10));
    }
  }, [query.episode, setEpisode]);

  // set the should use proxy by matching regex
  useEffect(() => {
    if (isLoading) return;

    if (!sources[0].file.match(proxyFreeUrls)) {
      setProxy(true);
    }
  }, [isLoading, setProxy, sources]);

  const routerRef = useRef(router);

  // replace the url in the browser
  useEffect(() => {
    routerRef.current.replace(
      {
        pathname: '/watch/[id]',
        query: { id: anime.id, episode },
      },
      `/watch/${anime.id}/?episode=${episode}`,
      {
        shallow: true,
      }
    );
  }, [anime.id, episode]);

  // get data about next airing episode
  const { nextAiringEpisode } = anime;

  return (
    <>
      <NextSeo
        title={`${
          anime.title.romaji || anime.title.english
        } | Episode ${episode}`}
        description={anime.description}
        openGraph={{
          images: [
            {
              type: 'large',
              url: anime.bannerImage,
              alt: `Banner Image for ${
                anime.title.english || anime.title.romaji
              }`,
            },
            {
              url: anime.coverImage.large || anime.coverImage.medium,
              alt: `Cover Image for ${
                anime.title.english || anime.title.romaji
              }`,
            },
          ],
        }}
      />

      <Header />

      <div className="lg:flex mt-4 space-x-4">
        <div className="flex-shrink-0 max-w-[800px] mx-auto sm:p-4 lg:p-0 lg:ml-4 lg:mx-0 lg:max-w-full lg:w-[65%]">
          {/* render the video player element */}
          {!isError ? (
            <VideoPlayer
              src={!isLoading && sources[0].file}
              referer={!isLoading ? referer : ''}
              shouldUseProxy={shouldUseProxy}
              poster={anime.bannerImage}
            />
          ) : (
            <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              Sorry, the anime video couldn&apos;t be found
            </p>
          )}

          {/* the title of what anime is playing */}
          <div className="flex w-full justify-between items-center">
            <p className="m-2 font-semibold text-white mt-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {`${anime.title.romaji || anime.title.english}${
                anime.format !== 'MOVIE' ? ` | Episode ${episode}` : ''
              }`}
            </p>
          </div>

          {/* list of genres */}
          <div className="flex flex-wrap mx-3 gap-x-1 sm:gap-x-2 gap-y-1">
            {anime.genres.map((genre) => (
              <Genre key={genre} genre={genre} />
            ))}
          </div>

          {/* Info about the next airing episode */}
          {nextAiringEpisode ? (
            <div className="text-gray-400 p-2 mt-2">
              {anime.title.romaji || anime.title.english} Episode{' '}
              {nextAiringEpisode.episode} will release on the{' '}
              {
                <div className="font-bold text-gray-400 inline-block">
                  {convertToDate(nextAiringEpisode.airingAt * 1000)}.
                </div>
              }{' '}
              Further episodes of the anime will air every{' '}
              {convertToTime(nextAiringEpisode.airingAt * 1000)}.
            </div>
          ) : null}

          <WatchControls />

          <Episode id={anime.id} episodes={totalEpisodes} />

          {/* Anime decription */}
          {anime.description ? (
            <p
              className="text-gray-400 p-2 mt-2"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />
          ) : null}
        </div>

        {/* Anime recommendations */}
        <div className="mx-auto">
          <p className="lg:mt-0 font-semibold text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
            Recommended animes
          </p>
          {recommended.map((recommendation) => (
            <RecommendationCard
              anime={recommendation}
              key={recommendation.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Watch;
