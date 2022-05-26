import React, { useRef, useState } from 'react';

import { setEpisode } from '@slices/episode';
import { useDispatch, useSelector } from '@store/store';

export interface PageButtonProps {
  start: number;
  end: number;
  onClick: () => void;
}

const PageButton: React.FC<PageButtonProps> = ({ start, end, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="active:scale-90 duration-75 transition ease-out px-2 py-1 hover:bg-gray-800 rounded-md bg-gray-700 text-gray-300"
    >
      {start}-{end}
    </button>
  );
};

const Episode: React.FC = () => {
  const episodes = useSelector((store) => store.gogoApi.totalEpisodes);

  const dispatch = useDispatch();

  const [currentPage, setPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  // Show 100 episodes per page.
  // for 123 episodes there should be 2 pages
  const pages = Math.ceil(episodes / 100);

  const episodeArray = Array.from({ length: episodes }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex m-2">
        <span className="text-gray-300 md:text-lg">Go to episode: </span>
        <input
          ref={inputRef}
          className="ml-2 w-32 outline-none p-1 text-gray-800 text-sm md:text-base placeholder-gray-700 rounded-sm"
          placeholder="Episode no."
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;

            dispatch(setEpisode(parseInt(inputRef.current.value, 10)));
            inputRef.current.value = '';
          }}
        ></input>
      </div>

      {episodes && (
        <div className="m-2">
          <div className="flex space-x-2">
            <span className="text-gray-300 text-lg">Episodes: </span>
            <div className="flex flex-wrap space-x-2">
              {new Array(pages).fill(1).map((_v, i) => (
                <PageButton
                  key={i + 1}
                  start={i * 100 + 1}
                  end={i * 100 + 100 > episodes ? episodes : i * 100 + 100}
                  onClick={() => setPage(i + 1)}
                />
              ))}
            </div>
          </div>

          <div className="py-1 gap-x-2 gap-y-1 grid grid-cols-11 sm:grid-cols-[repeat(16,_minmax(0,_1fr))] lg:grid-cols-[repeat(20,_minmax(0,_1fr))]  xl:grid-cols-[repeat(25,_minmax(0,_1fr))]">
            {episodeArray
              .slice((currentPage - 1) * 100, currentPage * 100)
              .map((v) => (
                <div
                  className="text-gray-800 bg-gray-100 py-[1px] px-1 rounded-sm hover:bg-gray-400"
                  key={v}
                  onClick={() => dispatch(setEpisode(v))}
                >
                  {v}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Episode;
