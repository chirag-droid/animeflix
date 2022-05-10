import useSWR from 'swr';

export default function useAnime(id, episode) {
  // eslint-disable-next-line no-shadow
  const fetcher = async (id, episode) =>
    fetch(`/api/anime/?id=${id}&episode=${episode}`).then((res) => res.json());

  const { data, error } = useSWR([id, episode], fetcher, {
    revalidateOnFocus: false,
  });

  return {
    videoLink: data?.videoLink || '',
    referer: data?.referer,
    episodes: data?.episodes,
    isLoading: !error && !data,
    isError: error,
  };
}
