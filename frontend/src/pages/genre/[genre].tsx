import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import { searchGenre } from '@animeflix/api';
import { AnimeInfoFragment } from '@animeflix/api/aniList';
import { NextSeo } from 'next-seo';

import Card from '@components/anime/Card';
import Header from '@components/Header';
import progressBar from '@components/Progress';

interface GenreProps {
  searchResults: AnimeInfoFragment[];
}

export const getServerSideProps: GetServerSideProps<GenreProps> = async (
  context
) => {
  let { genre } = context.params;

  genre = typeof genre === 'string' ? genre : genre.join('');

  const data = await searchGenre({
    genre,
    perPage: 25,
    page: 1,
  });

  return {
    props: {
      searchResults: data.Page.media,
    },
  };
};

const Genre = ({
  searchResults,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { genre } = router.query;

  progressBar.finish();

  return (
    <>
      <NextSeo title={`Animes for Genre ${genre} | Animeflix`} />

      <Header />

      <p className="mt-4 ml-3 text-base font-semibold text-white sm:ml-6 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Found {searchResults.length} results for Genre {genre}
      </p>

      <div className="mt-2 grid grid-cols-2 place-items-center gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchResults.map((anime) => (
          <Card key={anime.id} anime={anime} />
        ))}
      </div>
    </>
  );
};

export default Genre;
