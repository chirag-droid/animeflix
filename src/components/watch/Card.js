import Image from 'next/image';
import Link from 'next/link';

import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Icon from '@components/Icon';
import { base64SolidImage } from '@utility/image';

function Card({ anime }) {
  return (
    <Link href={`/watch/${anime.id}`} passHref>
      <a className="flex space-x-4 ml-2 mr-4 text-white py-2 h-30 cursor-pointer hover:scale-105 transform transition duration-300 ease-out">
        <div className="relative min-w-[6rem] min-h-[8rem] flex-shrink-1">
          <Image
            alt={anime.title.english || anime.title.romaji}
            src={
              anime.coverImage.large ||
              anime.coverImage.medium ||
              anime.bannerImage
            }
            layout="fill"
            objectPosition="left"
            className="rounded-md"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
              anime.coverImage.color
            )}`}
          />
        </div>

        <div className="flex flex-col">
          <p>{anime.title.english || anime.title.romaji}</p>

          <p className="text-gray-400">
            {`${anime.description.replace(/<\w*\\?>/g, '').slice(0, 70)}...`}
          </p>

          <div className="justify-end m-4 flex space-x-2 text-white text-xs">
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
}

export default Card;
