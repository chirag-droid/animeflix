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
    <header className="sticky top-0 bg-gray-900 w-full z-[51] h-12 flex items-center shadow-md">
      <Link href="/" passHref>
        <AnimeflixIcon className="w-7 h-7 ml-4 sm:ml-6 cursor-pointer" />
      </Link>

      <div className="flex rounded ml-4 sm:ml-6 bg-gray-50 py-[1px] items-center px-2">
        <SearchIcon className="w-4 h-4" />
        <input
          className="outline-none w-44 sm:w-56 md:w-64 lg:w-72 p-1 text-black bg-transparent text-sm placeholder-gray-400"
          placeholder="Search for Anime to watch"
          onKeyPress={handleKeyPress}
        ></input>
      </div>
    </header>
  );
};

export default Header;
