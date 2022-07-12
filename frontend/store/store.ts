import { useMemo } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';

import anime from '@slices/anime';
import episode from '@slices/episode';
import gogoApi from '@slices/gogoApi';
import timer from '@slices/timer';
import videoSettings from '@slices/videoSettings';

const createStore = (preloadedState?: { [x: string]: any }) =>
  configureStore({
    reducer: {
      anime,
      episode,
      videoSettings,
      timer,
      gogoApi,
    },
    preloadedState,
  });

let prevStore: Store | undefined;
export const initialiseStore = (preloadedState?: { [x: string]: any }) => {
  let newStore = prevStore ?? createStore(preloadedState);

  if (preloadedState && prevStore) {
    newStore = createStore({ ...prevStore.getState(), ...preloadedState });
    prevStore = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return newStore;
  // Create the store once in the client
  if (!prevStore) prevStore = newStore;

  return newStore;
};

export const useStore = (preloadedState?: { [x: string]: any }) =>
  useMemo(() => initialiseStore(preloadedState), [preloadedState]);

export type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store['getState']>;

type AppDispatch = Store['dispatch'];

// wrappers around the redux useDispatch and useSelectors for better types
export const useDispatch = () => useDispatchBase<AppDispatch>();

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
