import { useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AnimeBannerFragment } from '@animeflix/api/aniList';
import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Genre from '@components/Genre';
import Icon from '@components/Icon';
import progressBar from '@components/Progress';
import { stripHtml } from '@utility/utils';

export interface BannerProps {
  anime: AnimeBannerFragment;
}

const Banner: React.FC<BannerProps> = ({ anime }) => {
  const router = useRouter();

  // finish the progress bar if the bannerimage doesn't exist
  useEffect(() => {
    if (!anime.bannerImage) progressBar.finish();
  }, [anime.bannerImage]);

  return (
    <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]">
      {/* The image behind the banner */}
      {anime.bannerImage && (
        <Image
          priority
          src={anime.bannerImage}
          alt={`Banner for ${anime.title.english || anime.title.romaji}`}
          layout="fill"
          objectFit="cover"
          className="opacity-60"
          onLoadingComplete={progressBar.finish}
        />
      )}

      {/* The container that lies on top of the image */}
      <div className="absolute ml-4 mt-4 space-y-2 text-white sm:ml-8 sm:mt-6 md:space-y-3 lg:mt-8 xl:mt-10 2xl:mt-12">
        {/* the title */}
        <p className="text-xl font-extrabold line-clamp-1 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
          {anime.title.romaji || anime.title.english}
        </p>
        <p className="text-sm font-normal text-gray-300 line-clamp-1 sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
          {anime.title.english ?? anime.title.romaji}
        </p>

        {/* Icons showing the info about the anime */}
        <div className="flex space-x-2">
          <Icon icon={PlayIcon} text={anime.format} />
          <Icon icon={ClockIcon} text={`${anime.duration} Min/Ep`} />
          <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
        </div>

        {/* Array of the genres */}
        <div className="mr-2 flex flex-wrap gap-x-2 gap-y-1 sm:gap-x-3 md:gap-x-4">
          {anime.genres.map((genre) => (
            <Genre key={genre} genre={genre} />
          ))}
        </div>

        <p className="hidden max-w-3xl md:block md:line-clamp-3 lg:line-clamp-4 xl:line-clamp-5 2xl:line-clamp-6">
          {stripHtml(anime.description)}
        </p>

        {/* the button at the bottom */}
        <Link
          href={`/${router.route === '/' ? 'anime' : 'watch'}/${anime.id}`}
          passHref
        >
          <a>
            <button className="mt-2 flex transform items-center rounded-lg bg-[#C3073F] px-2 py-1 text-xs text-white transition duration-300 ease-in active:scale-90 sm:text-sm md:text-base">
              <PlayIcon className="mr-1 w-5" />
              {router.route === '/' ? 'Read More' : 'Watch Now'}
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
