# Animeflix

A anime discovery, streaming site made with NextJs and TailwindCSS. The app is deployed to https://animeplix.vercel.app, but its recommended to host it yourself.
The AniList api is used for fetching data which has a rate limit of 90 requests/min. For video data GogoAnime is scraped

Click the Deploy with Vercel to deploy it for yourself. You can also host on your own computer

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/chirag-droid/animeflix/&project-name=animeflix&repository-name=animeflix)

## Deploy on your computer

First download the repository using
```
git clone https://github.com/chirag-droid/animeflix
```

This should download this repository to your computer. Next, to download the dependencies run
```
npm i
```

Now build and start the production build of the site using
```
npm run build
npm run start
```

This will start the app on http://localhost:3000
