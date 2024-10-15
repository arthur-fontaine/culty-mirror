import { useCallback, useEffect, useState } from "react";
import type { Store } from "../utils/store.d";

export const useStoredState = <T>(
  key: string,
  initialValue: T,
  store: Store,
  serializer: {
    serialize: (value: T) => string | undefined;
    deserialize: (value: string) => T;
  } = {
      serialize: (value) => value === undefined ? undefined : JSON.stringify(value),
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
      const serializedValue = serializer.serialize(value);
      if (serializedValue === undefined) return;
      store.setItem(key, serializedValue);
    },
    [key, store, serializer]
  );

  useEffect(() => {
    if (loading) return;
    const serializedValue = serializer.serialize(state);
    if (serializedValue === undefined) return;
    store.setItem(key, serializedValue);
  }, [key, store, state, loading, serializer]);

  return [state, setStoredState, loading] as const;
};
