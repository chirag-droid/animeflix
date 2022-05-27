import Link from 'next/link';

export interface GenreProps {
  genre: string;
}

const Genre: React.FC<GenreProps> = ({ genre }) => {
  return (
    <Link href={`/genre/${genre}`} passHref>
      <a className="transform rounded bg-black p-1 text-xs text-white transition duration-300 ease-out hover:scale-105 sm:text-sm">
        {genre}
      </a>
    </Link>
  );
};

export default Genre;
