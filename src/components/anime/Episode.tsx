import Image from 'next/image';
import Link from 'next/link';

import { AnimeBannerFragment, AnimeInfoFragment } from '@generated/aniList';
import { EpisodeInfoFragment } from '@generated/kitsu';

export interface CardProps {
  anime: AnimeBannerFragment & AnimeInfoFragment;
  number: number;
  episode?: EpisodeInfoFragment | null;
}

const Card: React.FC<CardProps> = ({ anime, number, episode }) => {
  let title = episode ? episode.titles.canonical : `Episode No. ${number}`;

  if (title.length > 35) title = `${title.substr(0, 35)}...`;

  return (
    <Link href={`/watch/${anime.id}?episode=${number}`} passHref>
      <a className="w-64 transform cursor-pointer p-2 transition duration-300 ease-out hover:scale-105 sm:w-80">
        <div className="relative">
          <div className="relative h-40 w-64 sm:h-52 sm:w-80">
            <Image
              alt="Cover Image"
              src={
                (episode && episode.thumbnail?.original.url) ||
                anime.coverImage.large ||
                anime.coverImage.medium ||
                anime.bannerImage
              }
              objectFit="cover"
              layout="fill"
              objectPosition="center"
              className="rounded-md"
            />
          </div>
          <p className="absolute top-0 right-0 mt-2 h-12 text-xl font-bold text-white">
            {number}
          </p>
        </div>

        <div>
          <p className="mt-2 h-12 text-sm font-bold text-white">{title}</p>
        </div>
      </a>
    </Link>
  );
};

export default Card;
