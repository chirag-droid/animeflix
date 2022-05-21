import '@styles/globals.css';
import { AppProps } from 'next/app';
import Router from 'next/router';

import { DefaultSeo } from 'next-seo';

import progressBar from '@components/Progress';

// start progress bar when the route starts to change
Router.events.on('routeChangeStart', progressBar.start);

// finish the progress bar if there is an error while route change
Router.events.on('routeChangeError', progressBar.finish);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Animeflix - Watch animes without ads"
        description="Watch anime shows, tv, movies for free without ads on your mobile, tablet, or pc"
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'watch animes, animes online, anime adsfree, adfree anime',
          },
          {
            name: 'theme-color',
            content: '#C3073F',
          },
        ]}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          site_name: 'Animeflix',
          images: [
            {
              url: '/preview.png',
              alt: 'Site preview image',
              type: 'large',
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
