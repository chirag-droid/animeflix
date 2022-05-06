import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

function PageButton({ page, onClick }) {
  return (
    <button
      onClick={onClick}
      className="active:scale-90 duration-75 transition ease-out px-2 py-1 hover:bg-gray-800 rounded-md bg-gray-700 text-gray-300"
    >
      {page}
    </button>
  );
}

function Episode({ id, episodes }) {
  const router = useRouter();

  const [currentPage, setPage] = useState(1);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter')
      router.push({
        query: {
          id,
          episode: event.currentTarget.value,
        },
      });
  };

  if (!episodes) {
    return (
      <div className="flex m-2">
        <span className="text-gray-300 md:text-lg">Go to episode: </span>
        <input
          className="ml-2 w-32 outline-none p-1 text-gray-800 text-sm md:text-base placeholder-gray-700 rounded-sm"
          placeholder="Episode no."
          onKeyDown={handleKeyPress}
        ></input>
      </div>
    );
  }

  // Show 100 episodes per page.
  // for 123 episodes there should be 2 pages
  const pages = Math.ceil(episodes / 100);

  const episodeArray = Array.from({ length: episodes }, (_, i) => i + 1);

  return (
    <div className="m-2">
      <div className="flex space-x-2">
        <span className="text-gray-300 text-lg">Episodes: </span>
        <div className="flex flex-wrap space-x-2">
          {new Array(pages).fill(1).map((_v, i) => (
            <PageButton
              key={i + 1}
              page={i + 1}
              onClick={() => setPage(i + 1)}
            />
          ))}
        </div>
      </div>

      <div className="my-1 gap-x-2 gap-y-1 grid  xl:grid-cols-[repeat(21,_minmax(0,_1fr))]">
        {episodeArray
          .slice((currentPage - 1) * 100, currentPage * 100)
          .map((v) => (
            <Link key={v} passHref href={`/watch/${id}/?episode=${v}`}>
              <a className="text-gray-800">
                <div className="bg-gray-100 py-[1px] px-1 rounded-sm">{v}</div>
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Episode;
