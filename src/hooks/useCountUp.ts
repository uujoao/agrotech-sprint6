import { useEffect, useState } from "react";

/** Anima um número de 0 até `target` (usado nas estatísticas e nos KPIs). */
export function useCountUp(target: number, steps = 40, intervalMs = 30) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
    let current = 0;
    const step = target / steps;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(timer);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [target, steps, intervalMs]);

  return Math.round(value);
}
