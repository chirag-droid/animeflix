import Image from 'next/image';
import Link from 'next/link';

import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Icon from '@components/Icon';
import { base64SolidImage } from '@utility/image';

function Card({ anime }) {
  let title = anime.title.romaji || anime.title.english;

  if (title.length > 35) title = `${title.substr(0, 35)}...`;

  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <a className="cursor-pointer w-46 sm:w-56 p-2 hover:scale-105 transform transition duration-300 ease-out">
        <div className="relative w-40 sm:w-52 h-48 sm:h-64">
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
          <p className="h-12 text-sm mt-2 text-white font-bold">{title}</p>

          <div className="flex space-x-2 text-white text-xs">
            <Icon
              icon={PlayIcon}
              text={anime.format}
              className="hidden sm:flex"
            />
            <Icon icon={ClockIcon} text={`${anime.duration} Min`} />
            <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
          </div>

          <p className="text-gray-500 text-xs mt-2 float-right">
            Click to read more...
          </p>
        </div>
      </a>
    </Link>
  );
}

export default Card;
