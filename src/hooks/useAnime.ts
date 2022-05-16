import useSWR from 'swr';

export default function useAnime(id: number, episode: number) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetcher = async (id: number, episode: number) =>
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
