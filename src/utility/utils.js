export const proxyUrl = (url, referer) => {
  return `/api/video/proxy?src=${encodeURIComponent(
    url
  )}&referrer=${encodeURIComponent(referer)}`;
};
