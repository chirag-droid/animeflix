// @ts-check
const path = require('node:path');

const withPwa = require('next-pwa');

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  images: {
    domains: ['s4.anilist.co', 'media.kitsu.io'],
    disableStaticImages: true,
  },
  poweredByHeader: false,
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
};

module.exports = withPwa({
  ...nextConfig,
  pwa: {
    dest: 'public',
    // disable pwa when not in production
    disable: process.env.NODE_ENV !== 'production',
  },
});
