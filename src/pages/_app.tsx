import '@styles/globals.css';
import { AppProps } from 'next/app';
import Router from 'next/router';

import ProgressBar from '@badrap/bar-of-progress';
import { DefaultSeo } from 'next-seo';

export const progress = new ProgressBar({
  size: 4,
  color: '#C3073F',
  className: 'z-50',
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeError', progress.finish);

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
        ]}
        openGraph={{
          site_name: 'Animeflix',
          images: [
            {
              url: '/preview.jpeg',
              alt: 'Site preview image',
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
