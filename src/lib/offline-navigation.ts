import type { MouseEvent } from "react";

export function isOffline() {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function navigateOfflineAware(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  options?: { allowModifiedClick?: boolean }
) {
  if (!options?.allowModifiedClick) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }
  }

  if (!isOffline()) {
    return false;
  }

  event.preventDefault();
  window.location.assign(href);
  return true;
}
