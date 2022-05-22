import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface StreamData {
  animeId: number;
  episode: number;
  shouldUseProxy: boolean;
  isDub: boolean;
  time: number;
  totalEpisodes: number;

  setAnimeId: (animeId: number) => void;

  setEpisode: (episode: number) => void;
  incrementEpisode: () => void;
  decrementEpisode: () => void;

  setTotalEpisode: (totalEpisodes: number) => void;

  setProxy: (shouldUseProxy: boolean) => void;
  setDub: (isDub: boolean) => void;
}

const useStream = create<StreamData>()(
  devtools((set, get) => ({
    animeId: 0,
    episode: 1,
    shouldUseProxy: false,
    isDub: false,
    time: 0,
    totalEpisodes: 0,

    // sets the current anime id
    setAnimeId: (animeId) => {
      set({ shouldUseProxy: false });

      // set the anime
      set({ animeId });

      if (typeof localStorage === 'undefined') {
        set({ episode: 1 });
        set({ time: 0 });
        return;
      }

      // get saved episode and time data from localstorage
      const savedState = localStorage.getItem(`Anime${animeId}`) || '1-0';
      const [savedEpisode, savedTime] = savedState.split('-');

      // set the saved episode and time for the anime
      set({ episode: parseInt(savedEpisode, 10) });
      set({ time: parseInt(savedTime, 10) });
    },

    setEpisode: (episode: number) => {
      if (episode < 1) {
        set({ episode: 1 });
        return;
      }

      // set episode
      set({ episode });

      if (typeof localStorage === 'undefined') {
        set({ time: 0 });
        set({ episode: 1 });
        return;
      }

      // get saved time from localstorage
      const savedState = localStorage.getItem(`Anime${get().animeId}`) || '1-0';
      const savedTime = savedState.split('-')[1];

      // override the time value
      set({ time: parseInt(savedTime, 10) });

      set({ episode });
    },

    incrementEpisode: () => get().setEpisode(get().episode + 1),
    decrementEpisode: () => get().setEpisode(get().episode - 1),

    setTotalEpisode: (totalEpisodes) => set({ totalEpisodes }),

    setProxy: (shouldUseProxy) => set({ shouldUseProxy }),
    setDub: (isDub) => set({ isDub }),
  }))
);

export default useStream;
