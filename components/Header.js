import {SearchIcon} from '@heroicons/react/outline'

function Header() {
  return (
    <header className="bg-black w-full z-10 h-12 flex items-center shadow-md">
      <div className="flex rounded ml-10 bg-gray-50 py-[1px] items-center px-2">
        <SearchIcon className='w-4 h-4'/>
        <input
          className="outline-none w-72 p-1 text-black bg-transparent text-sm placeholder-gray-400"
          placeholder="Search for Anime to watch"
        >
        </input>
      </div>
    </header>
  )
}

export default Header