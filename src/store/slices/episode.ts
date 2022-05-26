/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface EpisodeState {
  episode: number;
}

const initialState: EpisodeState = {
  episode: 1,
} as const;

export const episodeSlice = createSlice({
  name: 'episode',
  initialState,
  reducers: {
    incrementEpisode: (state: Draft<EpisodeState>) => {
      state.episode += 1;
    },
    decrementEpisode: (state: Draft<EpisodeState>) => {
      if (!(state.episode <= 1)) state.episode -= 1;
    },
    setEpisode: (state: Draft<EpisodeState>, action: PayloadAction<number>) => {
      state.episode = action.payload;
    },
  },
});

export const { decrementEpisode, incrementEpisode, setEpisode } =
  episodeSlice.actions;

export default episodeSlice.reducer;
