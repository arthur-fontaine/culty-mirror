import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Store } from "./store.d";

export const store: Store = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
};
