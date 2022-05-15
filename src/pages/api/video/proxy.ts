import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { src, referer } = req.query;

  src = typeof src === 'string' ? src : src.join('');
  referer = typeof referer === 'string' ? referer : referer.join(' ');

  const options = {
    headers: {
      Referer: referer,
    },
  };

  // fetch the data from the url
  const response = await fetch(src, options);

  const setHeader = (header: string) => {
    res.setHeader(header, response.headers.get(header.toLowerCase()));
  };

  // set etag, and expires header so that the browser caches the video data
  setHeader('etag');
  setHeader('expires');

  // send the response data back to the client
  res.send(response.body);
}
