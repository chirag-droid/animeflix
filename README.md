<!-- PROJECT LOGO -->
<p align="center">
  <div align="center">
    <a href="https://github.com/chirag-droid/animeflix">
      <img src="https://aniflix.pro/favicon.ico" alt="Logo">
    </a>
    <h3>Animeflix - Watch animes online</h3>
    <!-- REPOSITORY INFO BADGES -->
    <a href="https://discord.gg/4UPU8etvae">
      <img src="https://img.shields.io/discord/971304939525644298?label=discord&logo=discord&color=5460e6&style=flat-square&labelColor=2b2f35">
    </a>
    <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">
      <img src="https://img.shields.io/github/license/chirag-droid/animeflix?logo=gnu&color=a32d2a&labelColor=333&logoColor=fff&style=flat-square">
    </a>
    <a href="https://github.com/chirag-droid/animeflix/stargazers">
      <img src="https://img.shields.io/github/stars/chirag-droid/animeflix?style=flat-square" alt="Github Stars">
    </a>
    <a href="https://github.com/chirag-droid/issues">
      <img src="https://img.shields.io/github/issues/chirag-droid/animeflix?style=flat-square">
    </a>
    <a href="https://github.com/chirag-droid/forks">
      <img src="https://img.shields.io/github/forks/chirag-droid/animeflix?style=flat-square">
    </a>
  </div>

  <hr />

  <p align="center">
    The open-source anime streaming service made with NextJs and TailwindCSS. It lets you search, watch animes without any ads with a beautiful ui. It can be self hosted or deployed online.
  </p>
</p>

<!-- DEPENDENCY BADGES -->
<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/github/package-json/dependency-version/chirag-droid/animeflix/next?filename=frontend/package.json&color=fff&labelColor=000&logo=nextdotjs&style=flat-square">
  </a>
  <a href="https://17.reactjs.org/">
    <img src="https://img.shields.io/github/package-json/dependency-version/chirag-droid/animeflix/react?filename=frontend/package.json&color=5fd9fb&logo=react&labelColor=222435&style=flat-square">
  </a>
  <a href="https://redux-toolkit.js.org/">
    <img src="https://img.shields.io/github/package-json/dependency-version/chirag-droid/animeflix/@reduxjs/toolkit?filename=frontend/package.json&label=redux-toolkit&color=593d88&logo=redux&labelColor=242526&style=flat-square&logoColor=b58bf7">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/github/package-json/dependency-version/chirag-droid/animeflix/dev/tailwindcss?filename=frontend/package.json&color=37b8f1&logo=tailwindcss&labelColor=0b1120&style=flat-square&logoColor=38bdf8">
  </a>
</p>

<!-- PREVIEW IMAGE -->
<img src="https://repository-images.githubusercontent.com/428654890/3eb14869-768d-4bdb-95a7-6e73bb347803">

<hr/>

## Acknowledgements

<!-- API INFO -->
<p align="center">
  <a href="https://graphql.com/">
    <img src="https://img.shields.io/github/package-json/dependency-version/chirag-droid/animeflix/graphql?filename=frontend/package.json&color=8080f2&labelColor=1a1c1e&logoColor=4b32c3&style=flat-square&logo=graphql">
  </a>
  <a href="https://github.com/riimuru/gogoanime/">
    <img src="https://img.shields.io/badge/riimuru/gogoanime-333.svg?style=flat-square">
  </a>
  <a href="https://anilist.co">
    <img src="https://img.shields.io/badge/AnList-222435.svg?logo=anilist&style=flat-square">
  </a>
  <a href="https://kitsu.io">
    <img src="https://img.shields.io/badge/Kitsu-402f3f.svg?logo=kitsu&style=flat-square">
  </a>
</p>

AniList and Kitsu are the underlying public free API's that are used for fetching the data about animes.

[riimuru/gogoanime-api](https://github.com/riimuru/gogoanime-api) is used for interacting with GogoAnime and scrape video soures.

Also thanks to these open source libraries Next.js, tailwindCSS, redux-toolkit, graphql etc.

## Online Deployment

Following are the recommended online deployment services which are tested to work with this project. If you want to add a deployment service just open an issue.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/NBfBbp?referralCode=km83_N)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chirag-droid/animeflix/tree/main&project-name=animeflix&repo-name=animeflix&root-directory=frontend&build-command=cd%20../%20%26%26%20yarn%20build&install-command=cd%20../%20%26%26%20yarn%20install)

[![Deploy with netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/chirag-droid/animeflix)

## Docker Deployment

The docker images for this app is available at dockerhub. [chiragdroid/animeflix](https://hub.docker.com/repository/docker/chiragdroid/animeflix).

Run it easily using this command

```
docker run -p 3000:3000 ghcr.io/chirag-droid/animeflix
```

This will start animeflix at port 3000. You can change the port by doing `-p <port>:3000`,

You can run this as a background service by adding `-d` flag

## Local Deployment

You need to have `nodejs` and `git` installed on your pc for following the intructions

First download the repository using
```
git clone https://github.com/chirag-droid/animeflix
```

Next make sure you have yarn installed on your system
```
npm i -g yarn
```
> this step probably requires admin perms

This should download this repository to your computer. Next, to download the dependencies run
```
yarn install
```

Now build and start the production build of the site using
```
yarn build
yarn start
```

This will start the app on http://localhost:3000

## Sponsor this project

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/chiragdroid)
