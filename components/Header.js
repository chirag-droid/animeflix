import {SearchIcon} from '@heroicons/react/outline'

function Header() {
  return (
    <header className="sticky top-0 bg-gray-900 w-full z-10 h-12 flex items-center shadow-md">
      <div className="flex rounded ml-4 sm:ml-6 md:ml-10 bg-gray-50 py-[1px] items-center px-2">
        <SearchIcon className='w-4 h-4'/>
        <input
          className="outline-none w-44 sm:w-56 md:w-64 lg:w-72 p-1 text-black bg-transparent text-sm placeholder-gray-400"
          placeholder="Search for Anime to watch"
        >
        </input>
      </div>
    </header>
  )
}

export default Header