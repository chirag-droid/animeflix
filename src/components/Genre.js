import Link from 'next/link';

function Genre({ genre }) {
  return (
    <Link href={`/genre/${genre}`} passHref>
      <p className="p-1 rounded text-xs sm:text-sm bg-white text-black cursor-pointer hover:scale-105 transform transition duration-300 ease-out">
        {genre}
      </p>
    </Link>
  );
}

export default Genre;
