import Image from 'next/image';
import Link from 'next/link';

import { base64SolidImage } from '@utility/image';

function Card({ anime, episode }) {
  let title = episode.episodeTitle;

  if (title.length > 35) title = `${title.substr(0, 35)}...`;

  return (
    <Link href={`/watch/${anime.id}?episode=${episode.episodeNum}`} passHref>
      <a className="cursor-pointer w-64 sm:w-80 p-2 hover:scale-105 transform transition duration-300 ease-out">
        <div className="relative">
          <div className="relative w-64 sm:w-80 h-40 sm:h-52">
            <Image
              alt="Cover Image"
              src={
                episode.episodeThumbnail ||
                anime.coverImage.large ||
                anime.coverImage.medium
              }
              objectFit="cover"
              layout="fill"
              objectPosition="center"
              className="rounded-md"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                episode.episodeThumbnail?.color
              )}`}
            />
          </div>
          <p className="h-12 text-xl mt-2 text-white font-bold absolute top-0 right-0">
            {episode.episodeNum}
          </p>
        </div>

        <div>
          <p className="h-12 text-sm mt-2 text-white font-bold">{title}</p>
        </div>
      </a>
    </Link>
  );
}

export default Card;
