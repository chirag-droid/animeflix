/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface AnimeState {
  anime: number;
}

const initialState: AnimeState = {
  anime: 1,
} as const;

export const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setAnime: (state: Draft<AnimeState>, action: PayloadAction<number>) => {
      state.anime = action.payload;
    },
  },
});

export const { setAnime } = animeSlice.actions;

export default animeSlice.reducer;
