'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Keep the server and first browser render identical, even when a lazy
// component arrives after shared client state has already changed.
export const useHydrated = () =>
  useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
