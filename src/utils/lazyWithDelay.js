import { lazy } from "react";

/**
 * Practical 8: Performance Optimization & Lazy Loading
 * Supplementary Problem 2: Minimum-delay fallback wrapper.
 * Prevents jarring UI flashes/flicker on ultra-fast networks by ensuring
 * the fallback state is displayed for a minimum perceptible threshold (e.g. 300ms).
 *
 * @param {Function} importFn - Dynamic import promise factory, e.g., () => import('./pages/Projects')
 * @param {number} minDelayMs - Guaranteed minimum delay in milliseconds (default: 300ms)
 * @returns {React.LazyExoticComponent} React lazy component
 */
export function lazyWithDelay(importFn, minDelayMs = 300) {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, minDelayMs))
    ]).then(([moduleExports]) => moduleExports)
  );
}

export default lazyWithDelay;
