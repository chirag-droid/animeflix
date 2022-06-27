/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface GogoApiState {
  totalEpisodes: number;
  sources: Array<{
    file: string;
  }>;
  currentSource: number;
  videoLink: string;
}

const initialState: GogoApiState = {
  totalEpisodes: 1,
  sources: [
    {
      file: 'https://example.com/404',
    },
  ],
  currentSource: 0,
  videoLink: 'https://example.com/404',
};

export const gogoApiSlice = createSlice({
  name: 'gogoApi',
  initialState,
  reducers: {
    setTotalEpisodes: (
      state: Draft<GogoApiState>,
      action: PayloadAction<number>
    ) => {
      state.totalEpisodes = action.payload;
    },
    setCurrentSource: (
      state: Draft<GogoApiState>,
      action: PayloadAction<number>
    ) => {
      if (action.payload < state.sources.length) return;

      state.currentSource = action.payload;
      state.videoLink = state.sources[state.currentSource].file;
    },
    setSources: (
      state: Draft<GogoApiState>,
      action: PayloadAction<GogoApiState['sources']>
    ) => {
      if (!action.payload || action.payload.length === 0) {
        state.sources = initialState.sources;
      } else {
        state.sources = action.payload;
      }
      state.currentSource = 0;
      state.videoLink = state.sources[state.currentSource].file;
    },
    resetSources: (state: Draft<GogoApiState>) => {
      state.sources = initialState.sources;
      state.currentSource = initialState.currentSource;
      state.videoLink = initialState.videoLink;
    },
  },
});

export const { setTotalEpisodes, setCurrentSource, setSources, resetSources } =
  gogoApiSlice.actions;

export default gogoApiSlice.reducer;
