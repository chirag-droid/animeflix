import Image from 'next/image';
import Link from 'next/link';

import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Icon from '@components/Icon';
import { AnimeInfoFragment } from '@generated/aniList';
import { base64SolidImage } from '@utility/image';

export interface CardProps {
  anime: AnimeInfoFragment;
}

const Card: React.FC<CardProps> = ({ anime }) => {
  let title = anime.title.romaji || anime.title.english;

  if (title.length > 35) title = `${title.substr(0, 35)}...`;

  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <a className="w-46 transform cursor-pointer p-2 transition duration-300 ease-out hover:scale-105 sm:w-56">
        <div className="relative h-48 w-40 sm:h-64 sm:w-52">
          <Image
            alt="Cover Image"
            src={anime.coverImage.large || anime.coverImage.medium}
            layout="fill"
            objectPosition="center"
            className="rounded-md"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
              anime.coverImage.color
            )}`}
          />
        </div>

        <div>
          <p className="mt-2 h-12 text-sm font-bold text-white">{title}</p>

          <div className="flex space-x-2 text-xs text-white">
            <Icon
              icon={PlayIcon}
              text={anime.format}
              className="hidden sm:flex"
            />
            <Icon icon={ClockIcon} text={`${anime.duration} Min`} />
            <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
          </div>

          <p className="float-right mt-2 text-xs text-gray-500">
            Click to read more...
          </p>
        </div>
      </a>
    </Link>
  );
};

export default Card;
