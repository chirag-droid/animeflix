import { getAnime } from '@utility/gogoanime';

export default async function handler(req, res) {
  const { id, episode } = req.query;

  res.json(await getAnime(id, episode));
}
