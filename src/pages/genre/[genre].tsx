import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Card from '@components/anime/Card';
import Header from '@components/Header';
import { AnimeInfoFragment } from '@generated/aniList';
import { searchGenre } from '@lib/api';
import { progress } from '@pages/_app';

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

  progress.finish();

  return (
    <>
      <Head>
        <title key="title">Animes for Genre {genre} | Animeflix</title>
      </Head>

      <Header />

      <p className="font-semibold text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Found {searchResults.length} results for Genre {genre}
      </p>

      <div className="gap-y-8 place-items-center mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchResults.map((anime) => (
          <Card key={anime.id} anime={anime} />
        ))}
      </div>
    </>
  );
};

export default Genre;
