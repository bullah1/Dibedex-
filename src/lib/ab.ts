/**
 * Lightweight A/B testing utility.
 * - Assigns a stable variant per visitor (localStorage), per experiment.
 * - Fires an `experiment_view` analytics event on first exposure.
 * - Attach `experiment` + `variant` to any downstream conversion event so you
 *   can slice results in GA4 / PostHog / Meta.
 */

import { useEffect, useState } from "react";
import { track } from "./analytics";

const STORAGE_PREFIX = "dbx_ab:";
const EXPOSED_PREFIX = "dbx_ab_seen:";

export type ExperimentConfig<V extends string> = {
  key: string;
  variants: readonly V[];
  /** Optional weights matching `variants` order. Defaults to even split. */
  weights?: readonly number[];
};

/** Deterministic variant pick given a random 0-1 number. */
function pick<V extends string>(cfg: ExperimentConfig<V>, r: number): V {
  const weights = cfg.weights ?? cfg.variants.map(() => 1);
  const total = weights.reduce((s, w) => s + w, 0);
  let acc = 0;
  for (let i = 0; i < cfg.variants.length; i++) {
    acc += weights[i] / total;
    if (r <= acc) return cfg.variants[i];
  }
  return cfg.variants[cfg.variants.length - 1];
}

export function getVariant<V extends string>(cfg: ExperimentConfig<V>): V {
  if (typeof window === "undefined") return cfg.variants[0];
  const storeKey = STORAGE_PREFIX + cfg.key;
  try {
    const existing = localStorage.getItem(storeKey) as V | null;
    if (existing && cfg.variants.includes(existing)) return existing;
  } catch {
    /* ignore */
  }
  const chosen = pick(cfg, Math.random());
  try {
    localStorage.setItem(storeKey, chosen);
  } catch {
    /* ignore */
  }
  return chosen;
}

/** React hook: returns the variant and fires `experiment_view` once. */
export function useExperiment<V extends string>(cfg: ExperimentConfig<V>): V {
  const [variant, setVariant] = useState<V>(cfg.variants[0]);

  useEffect(() => {
    const v = getVariant(cfg);
    setVariant(v);
    const seenKey = EXPOSED_PREFIX + cfg.key;
    try {
      if (!sessionStorage.getItem(seenKey)) {
        sessionStorage.setItem(seenKey, "1");
        track("experiment_view", { experiment: cfg.key, variant: v });
      }
    } catch {
      track("experiment_view", { experiment: cfg.key, variant: v });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.key]);

  return variant;
}
