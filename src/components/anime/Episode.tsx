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
      <a className="cursor-pointer w-64 sm:w-80 p-2 hover:scale-105 transform transition duration-300 ease-out">
        <div className="relative">
          <div className="relative w-64 sm:w-80 h-40 sm:h-52">
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
          <p className="h-12 text-xl mt-2 text-white font-bold absolute top-0 right-0">
            {number}
          </p>
        </div>

        <div>
          <p className="h-12 text-sm mt-2 text-white font-bold">{title}</p>
        </div>
      </a>
    </Link>
  );
};

export default Card;
