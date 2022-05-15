import { useState, useEffect, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Episode from '@components/Episode';
import Genre from '@components/Genre';
import Header from '@components/Header';
import RecommendationCard from '@components/watch/Card';
import { AnimeBannerFragment, AnimeInfoFragment } from '@generated/aniList';
import useAnime from '@hooks/useAnime';
import { watchPage } from '@lib/api';
import { progress } from '@pages/_app';
import { proxyUrl } from '@utility/utils';

const VideoPlayer = dynamic(() => import('@components/VideoPlayer'), {
  ssr: false,
});

interface WatchProps {
  anime: AnimeInfoFragment & AnimeBannerFragment;
  recommended: (AnimeInfoFragment & AnimeBannerFragment)[];
}

export const getServerSideProps: GetServerSideProps<WatchProps> = async (
  context
) => {
  let { id } = context.params;

  id = typeof id === 'string' ? id : id.join('');

  const data = await watchPage({
    id: parseInt(id, 10),
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

const Video = ({
  anime,
  recommended,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  let { id, episode } = router.query;

  let startTime = 0;

  if (typeof window === 'undefined') {
    episode = episode || '1';
  }

  if (episode === undefined && typeof window !== 'undefined') {
    // check if last watched episode in localstorage
    const savedState = localStorage.getItem(`Anime${id}`) || '1-0';
    const [savedEpisode, savedTime] = savedState.split('-');

    if (savedEpisode) {
      episode = savedEpisode;
    } else {
      episode = '1';
    }

    if (episode === savedEpisode) {
      startTime = parseInt(savedTime, 10);
    }

    router.push(
      {
        pathname: '/watch/[id]',
        query: { id, episode },
      },
      `/watch/${id}/?episode=${episode}`,
      {
        shallow: true,
      }
    );
  }

  progress.finish();

  id = typeof id === 'string' ? id : id.join('');
  episode = typeof episode === 'string' ? episode : episode.join('');

  const episodeInt = parseInt(episode, 10);
  const idInt = parseInt(id, 10);

  const { videoLink, referer, episodes, isError } = useAnime(idInt, episodeInt);

  const previousEpisode = () => {
    router.push(`/watch/${id}?episode=${episodeInt - 1}`);
  };

  const nextEpisode = () => {
    router.push(`/watch/${id}?episode=${episodeInt + 1}`);
  };

  const saveProgress = (time) => {
    // delete progress if on last episode
    if (episode === episodes.toString() && time > 60 * 10) {
      localStorage.removeItem(`Anime${id}`);
      return;
    }
    localStorage.setItem(`Anime${id}`, `${episode}-${time}`);
  };

  const urls = useMemo(() => {
    return /(gogocdn\.stream)|(manifest\.prod\.boltdns\.net)/;
  }, []);

  const [shouldUseProxy, setProxy] = useState(false);

  useEffect(() => {
    if (!videoLink) {
      setProxy(false);
      return;
    }
    setProxy(!videoLink.match(urls));
  }, [videoLink, urls]);

  return (
    <>
      <Header />

      <div className="lg:flex mt-4 space-x-4">
        <div className="flex-shrink-0 max-w-[800px] mx-auto sm:p-4 lg:p-0 lg:ml-4 lg:mx-0 lg:max-w-full lg:w-[65%]">
          {!isError ? (
            <VideoPlayer
              src={shouldUseProxy ? proxyUrl(videoLink, referer) : videoLink}
              poster={anime.bannerImage}
              nextCallback={nextEpisode}
              previousCallback={previousEpisode}
              saveProgressCallback={saveProgress}
              startTime={startTime}
            />
          ) : (
            <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              Sorry, the anime video couldn&apos;t be found
            </p>
          )}

          <div className="flex w-full justify-between items-center">
            <p className="m-2 font-semibold text-white mt-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {`${
                anime.title.romaji || anime.title.english
              } | Episode ${episode}`}
            </p>

            {/* Toggle button, whether to use proxy or not */}
            <label className="mr-2 relative text-white flex justify-between items-center p2">
              Use proxy?
              <input
                type="checkbox"
                checked={shouldUseProxy}
                onChange={() => setProxy(!shouldUseProxy)}
                className="absolute left-0 top-0 w-full h-full peer appearance-none"
              />
              <span
                className={`
                  w-9 h-5 flex items-center flex-shrink-0 bg-gray-300
                  ml-2 p-1 rounded-full
                  after:w-4 after:h-4 after:bg-gray-500 after:rounded-full after:shadow-lg
                  peer-checked:bg-red-500 peer-checked:after:bg-gray-800 peer-checked:after:translate-x-3 after:duration-300
                `}
              />
            </label>
          </div>

          <div className="flex flex-wrap mx-3 gap-x-1 sm:gap-x-2 gap-y-1">
            {anime.genres.map((genre) => (
              <Genre key={genre} genre={genre} />
            ))}
          </div>

          <Episode id={idInt} episodes={episodes} />

          {anime.description ? (
            <p
              className="text-gray-400 p-2 mt-2"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />
          ) : null}
        </div>

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

export default Video;
