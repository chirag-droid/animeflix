import { useRef } from 'react';

import AnimeCard from '@components/anime/Card';

function Section({ title, animeList }) {
  const animeListRef = useRef(null);

  return (
    <>
      <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {title}
      </p>

      <div
        tabIndex="0"
        className="outline-none flex mt-2 mb-8 space-x-4 scrollbar-hide overflow-x-scroll overflow-y-hidden ml-3 sm:ml-6"
        ref={animeListRef}
        onMouseEnter={() => animeListRef.current.focus()}
      >
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </>
  );
}

export default Section;
