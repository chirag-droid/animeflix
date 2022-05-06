import { useState, useEffect, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Episode from '@components/Episode';
import Genre from '@components/Genre';
import Header from '@components/Header';
import RecommendationCard from '@components/watch/Card';
import { progress } from '@pages/_app';
import client from '@utility/client';
import { animeInfoFragment } from '@utility/fragments';
import getAnime from '@utility/gogoanime';
import { proxyUrl } from '@utility/utils';

const VideoPlayer = dynamic(() => import('@components/VideoPlayer'), {
  ssr: false,
});

function Video({ videoLink, referer, anime, recommended }) {
  const router = useRouter();
  progress.finish();

  const { id, episode } = router.query;

  const previousEpisode = () => {
    router.push(`/watch/${id}?episode=${parseInt(episode, 10) - 1}`);
  };

  const nextEpisode = () => {
    router.push(`/watch/${id}?episode=${parseInt(episode, 10) + 1}`);
  };

  const urls = useMemo(() => {
    return /(gogocdn\.stream)|(manifest\.prod\.boltdns\.net)/;
  }, []);

  const [shouldUseProxy, setProxy] = useState(() => {
    if (!videoLink) return true;
    return !videoLink.match(urls);
  });

  useEffect(() => {
    if (!videoLink) {
      setProxy(true);
      return;
    }
    setProxy(!videoLink.match(urls));
  }, [videoLink, urls]);

  return (
    <>
      <Header />

      <div className="lg:flex mt-4 space-x-4">
        <div className="flex-shrink-0 max-w-[800px] mx-auto sm:p-4 lg:p-0 lg:ml-4 lg:mx-0 lg:max-w-full lg:w-[65%]">
          {videoLink ? (
            <VideoPlayer
              src={shouldUseProxy ? proxyUrl(videoLink, referer) : videoLink}
              poster={anime.bannerImage}
              nextCallback={nextEpisode}
              previousCallback={previousEpisode}
            />
          ) : (
            <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {"Sorry, the anime video couldn't be found"}
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

          <Episode id={id} episodes={anime.episodes} />

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
}

export async function getServerSideProps(context) {
  const { id, episode } = context.query;

  const query = `
  {
    anime: Media(id: ${id}) {
      title {
        english
        romaji
      }
      episodes
      bannerImage
      description
      genres
    }

    recommended: Page(perPage: 20) {
      recommendations(mediaId: ${id}, sort: RATING_DESC) {
        mediaRecommendation {
          bannerImage
          description
          ...animeInfoFragment
        }
      }
    }
  }

  ${animeInfoFragment}
  `;

  const data = await client.request(query);
  const { english, romaji } = data.anime.title;
  const recommended = data.recommended.recommendations.map(
    (anime) => anime.mediaRecommendation
  );

  const res = await Promise.all([
    getAnime(romaji, episode),
    getAnime(english, episode),
  ]).then((results) => results[0] || results[1]);

  let videoLink = null;
  let referer = null;
  if (res.videoLink !== undefined) {
    ({ videoLink, referer } = res);
  }

  return {
    props: {
      videoLink,
      referer,
      anime: data.anime,
      recommended,
    },
  };
}

export default Video;
