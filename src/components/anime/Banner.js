import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Genre from '@components/Genre';
import Icon from '@components/Icon';
import useMediaQuery from '@hooks/useMediaQuery';

function Banner({ anime, onLoadingComplete }) {
  const router = useRouter();

  const isMedium = useMediaQuery('(min-width: 768px)');
  const isLarge = useMediaQuery('(min-width: 1024px)');

  const { romaji, english } = anime.title;
  let title = romaji || english;
  title = `${title.split(' ').splice(0, 11).join(' ')}...`;

  let description = '';

  if (isLarge) description = `${anime.description.substr(0, 380)}...`;
  else if (isMedium) description = `${anime.description.substr(0, 300)}...`;

  // remove all the html tags
  description = description.replace(/<\w*\\?>/g, '');

  return (
    <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]">
      {/* The image behind the banner */}
      {anime.bannerImage ? (
        <Image
          alt=""
          onLoadingComplete={onLoadingComplete}
          priority
          src={anime.bannerImage}
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      ) : (
        onLoadingComplete()
      )}

      <div className="text-white absolute ml-4 sm:ml-8 mt-4 sm:mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 space-y-2 md:space-y-3">
        <p className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
          {title}
        </p>
        {english && english.length > 35 ? null : (
          <p className="text-gray-300 font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            {english}
          </p>
        )}

        <div className="flex space-x-2">
          <Icon icon={PlayIcon} text={anime.format} />
          <Icon icon={ClockIcon} text={`${anime.duration} Min/Ep`} />
          <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
        </div>

        <div className="flex flex-wrap gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 mr-2">
          {anime.genres.map((genre) => (
            <Genre key={genre} genre={genre} />
          ))}
        </div>

        <p className="max-w-3xl">{description}</p>

        <Link
          href={
            router.route === '/'
              ? `/anime/${anime.id}`
              : `/watch/${anime.id}?episode=1`
          }
          passHref
        >
          <a>
            <button className="flex-wra cursor-pointer flex items-center px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base bg-[#C3073F] text-white active:scale-90 transform transition duration-300 ease-in">
              <PlayIcon className="w-5 mr-1" />
              {router.route === '/' ? 'Read More' : 'Watch Now'}
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Banner;
