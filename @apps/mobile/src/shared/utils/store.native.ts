import * as SecureStore from 'expo-secure-store';
import type { Store } from "./store.d";

export const store: Store = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};
