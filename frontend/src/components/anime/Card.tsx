import Image from 'next/image';
import Link from 'next/link';

import { AnimeInfoFragment } from '@animeflix/api/aniList';
import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Icon from '@components/Icon';
import { base64SolidImage } from '@utility/image';

export interface CardProps {
  anime: AnimeInfoFragment;
}

const Card: React.FC<CardProps> = ({ anime }) => {
  const title = anime.title.romaji || anime.title.english;

  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <a className="w-46 transform p-2 transition duration-300 ease-out hover:scale-105 sm:w-56">
        <div className="aspect-w-7 aspect-h-9 relative w-40 sm:w-52">
          <Image
            alt="Cover Image"
            src={anime.coverImage.large || anime.coverImage.medium}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-md"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
              anime.coverImage.color
            )}`}
          />
        </div>

        <div>
          <p className="mt-2 h-9 text-sm font-bold text-white line-clamp-2">
            {title}
          </p>

          <div className="mt-3 flex space-x-2 text-xs text-white">
            <Icon
              icon={PlayIcon}
              text={anime.format}
              className="hidden sm:flex"
            />
            <Icon icon={ClockIcon} text={`${anime.duration} Min`} />
            <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
