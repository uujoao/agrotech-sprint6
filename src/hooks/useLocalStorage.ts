import { useCallback, useEffect, useState } from "react";

/**
 * Estado persistido em localStorage. A leitura acontece após a hidratação
 * para não divergir do HTML renderizado no servidor.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignora dados corrompidos */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage indisponível */
    }
  }, [key, value, loaded]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, loaded, reset };
}
