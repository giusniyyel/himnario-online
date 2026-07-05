"use client";

import { useEffect, useState } from "react";
import {
  readUserSettings,
  writeReadingSettings,
  type LyricAlignPreference,
  type ThemePreference
} from "@/services/local-storage/user-preferences";

export function useReadingPreferences() {
  const [textScale, setTextScale] = useState(1);
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [lyricAlign, setLyricAlign] = useState<LyricAlignPreference>("center");
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const settings = readUserSettings();
      setTextScale(settings.textScale);
      setTheme(settings.theme);
      setLyricAlign(settings.lyricAlign);
      setHasLoadedSettings(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--reader-scale", String(textScale));
    document.documentElement.style.setProperty("--reader-align", lyricAlign);

    if (!hasLoadedSettings) {
      return;
    }

    writeReadingSettings({ textScale, theme, lyricAlign });
  }, [hasLoadedSettings, textScale, theme, lyricAlign]);

  return {
    textScale,
    setTextScale,
    theme,
    setTheme,
    lyricAlign,
    setLyricAlign
  };
}
