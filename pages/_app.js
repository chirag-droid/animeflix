import '@styles/globals.css'
import ProgressBar from '@badrap/bar-of-progress'
import Router from 'next/router'

export const progress = new ProgressBar({
  size: 4,
  color: "#C3073F",
  className: "z-50",
  delay: 100
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
