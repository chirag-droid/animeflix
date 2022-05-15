import { useRouter } from 'next/router';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Card from '@components/anime/Card';
import Header from '@components/Header';
import { SearchAnimeQuery } from '@generated/aniList';
import { searchAnime } from '@lib/api';
import { progress } from '@pages/_app';

interface SearchResult {
  searchResults: SearchAnimeQuery;
}

export const getServerSideProps: GetServerSideProps<SearchResult> = async (
  context
) => {
  const { keyword } = context.query;
  const data = await searchAnime({
    keyword: typeof keyword === 'string' ? keyword : keyword.join(' '),
    page: 1,
    perPage: 20,
  });

  return {
    props: {
      searchResults: data,
    },
  };
};

const Search = ({
  searchResults,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { keyword } = router.query;

  progress.finish();

  return (
    <>
      <Header />

      <p className="text-white mt-4 ml-3 sm:ml-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Results for {keyword}
      </p>

      <div className="gap-y-8 place-items-center mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchResults.Page.media.map((anime) => (
          <Card key={anime.id} anime={anime} />
        ))}
      </div>
    </>
  );
};

export default Search;
