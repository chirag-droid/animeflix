/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface VideoSettingsState {
  useDub: boolean;
  useProxy: boolean;
}

const initialState: VideoSettingsState = {
  useDub: false,
  useProxy: false,
} as const;

export const videoSettingsSlice = createSlice({
  name: 'videoSettings',
  initialState,
  reducers: {
    toggleProxy: (state: Draft<VideoSettingsState>) => {
      state.useProxy = !state.useProxy;
    },
    toggleDub: (state: Draft<VideoSettingsState>) => {
      state.useDub = !state.useDub;
    },
    setProxy: (
      state: Draft<VideoSettingsState>,
      action: PayloadAction<boolean>
    ) => {
      state.useProxy = action.payload;
    },
    setDub: (
      state: Draft<VideoSettingsState>,
      action: PayloadAction<boolean>
    ) => {
      state.useDub = action.payload;
    },
  },
});

export const { setDub, setProxy, toggleDub, toggleProxy } =
  videoSettingsSlice.actions;

export default videoSettingsSlice.reducer;
