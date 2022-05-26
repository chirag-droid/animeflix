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
import useVideoSources from '@hooks/useVideoSources';
import { watchPage } from '@lib/api';
import { proxyFreeUrls } from '@lib/constants';
import { setAnime } from '@slices/anime';
import { setEpisode } from '@slices/episode';
import { setSources, setTotalEpisodes, resetSources } from '@slices/gogoApi';
import { setProxy } from '@slices/videoSettings';
import { initialiseStore, useDispatch, useSelector } from '@store/store';
import { convertToDate, convertToTime } from '@utility/time';
import { arrayToString, proxyUrl } from '@utility/utils';

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
  const store = initialiseStore();

  const { id } = context.params;
  const { episode } = context.query;

  store.dispatch(setAnime(parseInt(arrayToString(id), 10)));

  if (episode) {
    store.dispatch(setEpisode(parseInt(arrayToString(episode), 10)));
  }

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
      initialReduxState: store.getState(),
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

  const dispatch = useDispatch();
  const [animeId, episode] = useSelector((store) => [
    store.anime.anime,
    store.episode.episode,
  ]);
  const { useDub, useProxy } = useSelector((store) => store.videoSettings);
  const videoLink = useSelector((store) => store.gogoApi.videoLink);

  const routerRef = useRef(router);

  useEffect(() => {
    if (routerRef.current.query.episode) return;

    const savedEpisode = localStorage
      .getItem(`Anime${animeId}`)
      .split('-')
      .map((v) => parseInt(v, 10))[0];

    dispatch(setEpisode(savedEpisode));
  }, [animeId, dispatch]);

  // update the router url
  useEffect(() => {
    routerRef.current.replace(
      {
        pathname: '/watch/[id]',
        query: { id: animeId, episode },
      },
      `/watch/${animeId}/?episode=${episode}`,
      {
        shallow: true,
      }
    );
  }, [animeId, episode]);

  // get the videolink, episode of the anime
  const { sources, referer, isError, isLoading, episodes } = useVideoSources(
    animeId,
    episode,
    useDub
  );

  // set the videosources
  useEffect(() => {
    if (isLoading) {
      dispatch(resetSources());
    }
    dispatch(setSources(sources));
  }, [dispatch, isLoading, sources]);

  // set the total episodes the animes has
  useEffect(() => {
    if (isLoading) return;
    dispatch(setTotalEpisodes(episodes));
  }, [dispatch, episodes, isLoading]);

  // set the should use proxy by matching regex
  useEffect(() => {
    if (isLoading) return;

    dispatch(setProxy(!sources[0].file.match(proxyFreeUrls)));
  }, [dispatch, isLoading, sources]);

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
              src={useProxy ? proxyUrl(videoLink, referer) : videoLink}
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

          <Episode />

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
