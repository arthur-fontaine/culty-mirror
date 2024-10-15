import { useState, useEffect, useCallback } from "react";
import type { Store } from "../utils/store.d";

export const useStoredState = <T>(
  key: string,
  initialValue: T,
  store: Store,
  serializer: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  } = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }
) => {
  const [state, setState] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.getItem(key).then((value) => {
      if (value) {
        setState(serializer.deserialize(value));
      }
      setLoading(false);
    });
  }, [key, store, serializer]);

  const setStoredState = useCallback(
    (value: T) => {
      setState(value);
      store.setItem(key, serializer.serialize(value));
    },
    [key, store, serializer]
  );

  useEffect(() => {
    if (loading) return;
    store.setItem(key, serializer.serialize(state));
  }, [key, store, state, loading, serializer]);

  return [state, setStoredState, loading] as const;
};
