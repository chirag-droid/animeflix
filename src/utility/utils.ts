export const proxyUrl = (url: string, referer: string) => {
  return `/api/video/proxy?src=${encodeURIComponent(
    url
  )}&referer=${encodeURIComponent(referer)}`;
};

export const arrayToString = (data: string | string[]) =>
  typeof data === 'string' ? data : data.join('');
