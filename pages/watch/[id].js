import Header from "@components/Header";
import { progress } from "@pages/_app";
import client from "@utility/client";
import getAnime from "@utility/gogoanime";
import { slugify } from "@utility/utils";
import { animeInfoFragment } from "@utility/fragments";
import RecommendationCard from "@components/watch/Card";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Genre from "@components/Genre";

const VideoPlayer = dynamic(() => import("@components/VideoPlayer"), { ssr: false });

function Video({ videoLink, referrer, anime, recommended }) {
  const router = useRouter();
  progress.finish();

  const { id, episode } = router.query;

  const previousEpisode = () => {
    router.push(`/watch/${id}?episode=${parseInt(episode) - 1}`);
  };

  const nextEpisode = () => {
    router.push(`/watch/${id}?episode=${parseInt(episode) + 1}`);
  };

  return (
    <>
      <Header />

      <div className="lg:flex mt-4 space-x-4">
        <div className="flex-shrink-0 max-w-[800px] mx-auto sm:p-4 lg:p-0 lg:ml-4 lg:mx-0 lg:max-w-full lg:w-[65%]">
          {videoLink ? (
            <VideoPlayer
              src={videoLink}
              referrer={referrer}
              poster={anime.bannerImage}
              nextCallback={nextEpisode}
              previousCallback={previousEpisode}
            />
          ) : (
            <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {"Sorry, the anime video couldn't be found"}
            </p>
          )}

          <p className="m-2 font-semibold text-white mt-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
            {`${anime.title.romaji || anime.title.english} | Episode ${episode}`}
          </p>

          <div className="ml-3 grid grid-cols-4 gap-x-1 sm:gap-x-3 md:gap-x-4 gap-y-1 mr-2 md:flex">
            {anime.genres.map((genre) => (
              <Genre key={genre} genre={genre} />
            ))}
          </div>

          {anime.description ? (
            <p className="text-gray-400 p-2 mt-2" dangerouslySetInnerHTML={{ __html: anime.description }} />
          ) : null}
        </div>

        <div className="mx-auto">
          <p className="lg:mt-0 font-semibold text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
            Recommended animes
          </p>
          {recommended.map((anime) => (
            <RecommendationCard anime={anime} key={anime.id} />
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
  const recommended = data.recommended.recommendations.map((anime) => anime.mediaRecommendation);

  let res = await Promise.all([getAnime(romaji, episode), getAnime(english, episode)]).then(
    (results) => results[0] || results[1]
  );

  let videoLink,
    referrer = null;
  if (res !== undefined) {
    ({ videoLink, referrer } = res);
  }

  return {
    props: {
      videoLink,
      referrer,
      anime: data.anime,
      recommended,
    },
  };
}

export default Video;
