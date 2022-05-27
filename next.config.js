// @ts-check
const withPwa = require('next-pwa');

module.exports = withPwa({
  images: {
    domains: ['s4.anilist.co', 'media.kitsu.io'],
    disableStaticImages: true,
  },
  poweredByHeader: false,
  pwa: {
    dest: 'public',
  },
});
