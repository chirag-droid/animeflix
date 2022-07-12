import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import { searchAnime } from '@animeflix/api';
import { SearchAnimeQuery } from '@animeflix/api/aniList';
import { NextSeo } from 'next-seo';

import Card from '@components/anime/Card';
import Header from '@components/Header';
import progressBar from '@components/Progress';

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

  progressBar.finish();

  return (
    <>
      <NextSeo title={`Results for ${keyword} | Animeflix`} />

      <Header />

      <p className="mt-4 ml-3 text-base text-white sm:ml-6 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        Results for {keyword}
      </p>

      <div className="mt-2 grid grid-cols-2 place-items-center gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchResults.Page.media.map((anime) => (
          <Card key={anime.id} anime={anime} />
        ))}
      </div>
    </>
  );
};

export default Search;
