import React, { useRef } from 'react';

import EpisodeCard from '@components/anime/Episode';
import { AnimeBannerFragment } from '@generated/aniList';
import { EpisodesListFragment } from '@generated/kitsu';

export interface SectionProps {
  anime: AnimeBannerFragment;
  episodes: EpisodesListFragment;
}

const Section: React.FC<SectionProps> = ({ anime, episodes }) => {
  const animeListRef = useRef(null);

  return (
    <>
      <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Episodes
      </p>

      <div
        tabIndex={0}
        className="outline-none flex mt-2 mb-8 space-x-4 scrollbar-hide overflow-x-scroll overflow-y-hidden ml-3 sm:ml-6"
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
