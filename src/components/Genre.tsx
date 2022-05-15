import Link from 'next/link';

export interface GenreProps {
  genre: string;
}

const Genre: React.FC<GenreProps> = ({ genre }) => {
  return (
    <Link href={`/genre/${genre}`} passHref>
      <a className="p-1 rounded text-xs sm:text-sm bg-white text-black cursor-pointer hover:scale-105 transform transition duration-300 ease-out">
        {genre}
      </a>
    </Link>
  );
};

export default Genre;
