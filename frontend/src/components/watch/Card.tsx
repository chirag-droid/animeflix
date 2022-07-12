import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AnimeBannerFragment, AnimeInfoFragment } from '@animeflix/api/aniList';
import { ClockIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';

import Icon from '@components/Icon';
import { base64SolidImage } from '@utility/image';

export interface CardProps {
  anime: AnimeInfoFragment & AnimeBannerFragment;
}

const Card: React.FC<CardProps> = ({ anime }) => {
  return (
    <Link href={`/watch/${anime.id}`} passHref>
      <a className="ml-2 mr-4 flex transform space-x-4 py-2 text-white transition duration-300 ease-out hover:scale-105">
        {/* Card Image */}
        <div className="aspect-h-1 aspect-w-3 relative w-24 flex-shrink-0">
          <Image
            alt={anime.title.english || anime.title.romaji}
            src={anime.coverImage.large || anime.coverImage.medium}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
              anime.coverImage.color
            )}`}
          />
        </div>

        <div className="flex flex-col">
          <p className="line-clamp-1">
            {anime.title.english || anime.title.romaji}
          </p>

          <p className="text-gray-400 line-clamp-2">
            {anime.description.replace(/<\w*\\?>/g, '')}
          </p>

          <div className="m-4 flex justify-end space-x-2 text-xs text-white">
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
