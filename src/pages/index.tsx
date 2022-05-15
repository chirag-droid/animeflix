import { useEffect } from 'react';

import { InferGetServerSidePropsType } from 'next';

import Banner from '@components/anime/Banner';
import Section from '@components/anime/Section';
import Header from '@components/Header';
import { indexPage } from '@lib/api';
import { progress } from '@pages/_app';

export const getServerSideProps = async () => {
  const data = await indexPage({
    perPage: 8,
    page: 1,
    seasonYear: new Date().getFullYear(),
  });

  return {
    props: {
      ...data,
    },
  };
};

const Index = ({
  banner,
  trending,
  popular,
  topRated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    progress.finish();
  });

  return (
    <>
      <Header />

      <Banner anime={banner} onLoadingComplete={progress.finish} />

      <Section title="Trending Now" animeList={trending.media} />
      <Section title="Popular" animeList={popular.media} />
      <Section title="Top Rated (All time)" animeList={topRated.media} />
    </>
  );
};

export default Index;
