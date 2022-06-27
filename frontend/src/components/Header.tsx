import Link from 'next/link';
import { useRouter } from 'next/router';

import { SearchIcon } from '@heroicons/react/outline';

import AnimeflixIcon from '@components/AnimeFlixIcon';

const Header: React.FC<{}> = () => {
  const router = useRouter();

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter')
      router.push(`/search?keyword=${event.currentTarget.value}`);
  };

  return (
    <header className="sticky top-0 z-[51] flex h-12 w-full items-center bg-gray-900 shadow-md">
      <Link href="/" passHref>
        <a>
          <AnimeflixIcon className="ml-4 h-7 w-7 cursor-pointer sm:ml-6" />
        </a>
      </Link>

      <div className="ml-4 flex items-center rounded bg-gray-50 py-[1px] px-2 sm:ml-6">
        <SearchIcon className="h-4 w-4" />
        <input
          className="w-44 bg-transparent p-1 text-sm text-black placeholder-gray-400 outline-none sm:w-56 md:w-64 lg:w-72"
          placeholder="Search for Anime to watch"
          onKeyPress={handleKeyPress}
        ></input>
      </div>
    </header>
  );
};

export default Header;
