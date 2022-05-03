import { useEffect } from 'react';

import Section from '@components/anime/Section';
import { progress } from '@pages/_app';
import client from '@utility/client';
import { animeBannerFragment, animeInfoFragment } from '@utility/fragments';

import Banner from '../components/anime/Banner';
import Header from '../components/Header';

export default function Home({ banner, trending, popular, topRated }) {
  useEffect(() => {
    progress.finish();
  });

  return (
    <>
      <Header />

      <Banner anime={banner} onLoadingComplete={progress.finish} />

      <Section title="Trending Now" animeList={trending} />
      <Section title="Popular" animeList={popular} />
      <Section title="Top Rated (All time)" animeList={topRated} />
    </>
  );
}

export async function getServerSideProps() {
  const query = `
  {
    banner: Media(type: ANIME, sort: POPULARITY_DESC, seasonYear: ${new Date().getFullYear()}) {
      ...animeBannerFragment
    }

    trending: Page(perPage: 7) {
      media(sort: TRENDING_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }

    popular: Page(perPage: 7) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }

    topRated: Page(perPage: 7) {
      media(sort: SCORE_DESC, type: ANIME) {
        ...animeInfoFragment
      }
    }
  }

  ${animeBannerFragment}
  ${animeInfoFragment}
  `;

  const data = await client.request(query);

  return {
    props: {
      banner: data.banner,
      trending: data.trending.media,
      popular: data.popular.media,
      topRated: data.topRated.media,
    },
  };
}
