import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import {
  useBrowserLocation,
  type BrowserLocationHook,
} from 'wouter/use-browser-location';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function canStartViewTransition(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !prefersReducedMotion()
  );
}

/** Browser location hook with View Transitions API (graceful no-op fallback). */
export const useViewTransitionLocation: BrowserLocationHook = (options) => {
  const [path, navigate] = useBrowserLocation(options);

  const navigateWithTransition = useCallback<typeof navigate>(
    (to, navOptions) => {
      if (!canStartViewTransition()) {
        navigate(to, navOptions);
        return;
      }
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(to, navOptions);
        });
      });
    },
    [navigate],
  );

  return [path, navigateWithTransition];
};
