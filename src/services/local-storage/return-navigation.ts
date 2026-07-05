"use client";

export type ReturnNavigationSource = "catalog" | "favorites" | "search";

type ReturnNavigationIntent = {
  source: ReturnNavigationSource;
  sourceHref: string;
  targetHref: string;
  createdAt: number;
};

const key = "himnario:v1:return-navigation";
const maxAgeMs = 10 * 60 * 1000;

export function writeReturnNavigationIntent(intent: Omit<ReturnNavigationIntent, "createdAt">) {
  writeJson({
    ...intent,
    createdAt: Date.now()
  });
}

export function canUseReturnHistory(currentHref: string, source: ReturnNavigationSource) {
  const intent = readIntent();

  if (!intent) {
    return false;
  }

  const isFresh = Date.now() - intent.createdAt <= maxAgeMs;
  const matches = intent.source === source && intent.targetHref === currentHref;

  if (!isFresh || !matches) {
    clearReturnNavigationIntent();
    return false;
  }

  return true;
}

export function clearReturnNavigationIntent() {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Session storage can be unavailable in private browsing.
  }
}

function readIntent(): ReturnNavigationIntent | null {
  try {
    const value = window.sessionStorage.getItem(key);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as Partial<ReturnNavigationIntent>;

    if (
      (parsed.source === "catalog" || parsed.source === "favorites" || parsed.source === "search") &&
      typeof parsed.sourceHref === "string" &&
      typeof parsed.targetHref === "string" &&
      typeof parsed.createdAt === "number"
    ) {
      return parsed as ReturnNavigationIntent;
    }
  } catch {
    return null;
  }

  return null;
}

function writeJson(value: ReturnNavigationIntent) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session storage can be unavailable in private browsing or quota pressure.
  }
}
