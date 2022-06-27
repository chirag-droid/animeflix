/* eslint-disable no-param-reassign */
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
  startTime: number;
  currentTime: number;
}

const initialState: TimerState = {
  startTime: 0,
  currentTime: 0,
} as const;

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setStartTime: (state: Draft<TimerState>, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    setCurrentTime: (
      state: Draft<TimerState>,
      action: PayloadAction<number>
    ) => {
      if (state.currentTime === Math.ceil(action.payload)) return;
      state.currentTime = Math.ceil(action.payload);
    },
  },
});

export const { setStartTime, setCurrentTime } = timerSlice.actions;

export default timerSlice.reducer;
