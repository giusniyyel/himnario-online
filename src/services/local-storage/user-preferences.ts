"use client";

export type ThemePreference = "light" | "dark";
export type LyricAlignPreference = "left" | "center";

export type LocalUserSettings = {
  favoriteIds: string[];
  recentIds: string[];
  textScale: number;
  theme: ThemePreference;
  lyricAlign: LyricAlignPreference;
};

const keys = {
  favorites: "himnario:v1:favorites",
  recents: "himnario:v1:recents",
  settings: "himnario:v1:settings"
};

const maxRecentHymns = 8;

const defaults: LocalUserSettings = {
  favoriteIds: [],
  recentIds: [],
  textScale: 1,
  theme: "light",
  lyricAlign: "center"
};

export function readUserSettings(): LocalUserSettings {
  if (typeof window === "undefined") {
    return defaults;
  }

  return {
    favoriteIds: readStringArray(keys.favorites),
    recentIds: readStringArray(keys.recents),
    ...readSettingsObject()
  };
}

export function writeFavorites(ids: string[]) {
  writeJson(keys.favorites, unique(ids));
}

export function writeRecents(ids: string[]) {
  writeJson(keys.recents, unique(ids).slice(0, maxRecentHymns));
}

export function addRecent(id: string) {
  const current = readUserSettings().recentIds.filter((recentId) => recentId !== id);
  writeRecents([id, ...current]);
}

export function toggleFavorite(id: string) {
  const current = readUserSettings().favoriteIds;
  const next = current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [id, ...current];
  writeFavorites(next);
  return next;
}

export function writeReadingSettings(settings: Pick<LocalUserSettings, "textScale" | "theme" | "lyricAlign">) {
  writeJson(keys.settings, {
    textScale: clampScale(settings.textScale),
    theme: settings.theme === "dark" ? "dark" : "light",
    lyricAlign: settings.lyricAlign === "left" ? "left" : "center"
  });
}

function readSettingsObject(): Pick<LocalUserSettings, "textScale" | "theme" | "lyricAlign"> {
  const raw = readJson(keys.settings);

  if (!raw || typeof raw !== "object") {
    return {
      textScale: defaults.textScale,
      theme: defaults.theme,
      lyricAlign: defaults.lyricAlign
    };
  }

  const settings = raw as Partial<LocalUserSettings>;

  return {
    textScale: clampScale(Number(settings.textScale) || defaults.textScale),
    theme: settings.theme === "dark" ? "dark" : "light",
    lyricAlign: settings.lyricAlign === "left" ? "left" : "center"
  };
}

function readStringArray(key: string) {
  const raw = readJson(key);
  return Array.isArray(raw) ? raw.filter((value): value is string => typeof value === "string") : [];
}

function readJson(key: string): unknown {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be unavailable in private browsing or quota pressure.
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function clampScale(value: number) {
  return Math.min(1.35, Math.max(0.85, value));
}
