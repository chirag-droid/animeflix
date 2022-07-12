import '@styles/globals.css';
import { AppProps } from 'next/app';
import Router from 'next/router';

import { DefaultSeo } from 'next-seo';
import { Provider } from 'react-redux';

import progressBar from '@components/Progress';
import { useStore } from '@store/store';

// start progress bar when the route starts to change
Router.events.on('routeChangeStart', progressBar.start);

// finish the progress bar if there is an error while route change
Router.events.on('routeChangeError', progressBar.finish);

function MyApp({ Component, pageProps }: AppProps) {
  const reduxStore = useStore(pageProps.initialReduxState);

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
            content: '#0F0F0F',
          },
          {
            name: 'applie-mobile-web-app-capable',
            content: 'yes',
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#0F0F0F',
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
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
