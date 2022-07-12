import React, { useRef } from 'react';

import { AnimeInfoFragment } from '@animeflix/api/aniList';

import AnimeCard from '@components/anime/Card';

export interface SectionProps {
  title: string;
  animeList: AnimeInfoFragment[];
}

const Section: React.FC<SectionProps> = ({ title, animeList }) => {
  const animeListRef = useRef(null);

  return (
    <div>
      <p className="mt-4 ml-3 text-base font-semibold text-white sm:ml-6 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {title}
      </p>

      <div
        tabIndex={0}
        className="mt-2 mb-8 ml-2 flex space-x-4 overflow-y-hidden overflow-x-scroll p-1 outline-none scrollbar-hide sm:ml-6"
        ref={animeListRef}
        onMouseEnter={() => animeListRef.current.focus()}
      >
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default Section;
