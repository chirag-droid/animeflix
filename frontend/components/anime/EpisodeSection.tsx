import React, { useRef } from 'react';

import { AnimeBannerFragment } from '@animeflix/api/aniList';
import { EpisodesListFragment } from '@animeflix/api/kitsu';

import EpisodeCard from '@components/anime/Episode';

export interface SectionProps {
  anime: AnimeBannerFragment;
  episodes: EpisodesListFragment;
}

const Section: React.FC<SectionProps> = ({ anime, episodes }) => {
  const animeListRef = useRef(null);

  return (
    <>
      <p className="mt-4 ml-3 text-base font-semibold text-white sm:ml-6 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Episodes
      </p>

      <div
        tabIndex={0}
        className="mt-2 mb-8 ml-3 flex space-x-4 overflow-y-hidden overflow-x-scroll outline-none scrollbar-hide sm:ml-6"
        ref={animeListRef}
        onMouseEnter={() => animeListRef.current.focus()}
      >
        {new Array(episodes.episodeCount > 8 ? 8 : episodes.episodeCount)
          .fill(1)
          .map((_v, i) => (
            <EpisodeCard
              key={i + 1}
              anime={anime}
              number={i + 1}
              episode={episodes.episodes.nodes[i]}
            />
          ))}
      </div>
    </>
  );
};

export default Section;
