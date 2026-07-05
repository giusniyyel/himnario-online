"use client";

import {
  AlignCenter,
  AlignLeft,
  Minus,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { LyricAlignPreference, ThemePreference } from "@/services/local-storage/user-preferences";

export function ReadingSettingsControls({
  textScale,
  setTextScale,
  lyricAlign,
  setLyricAlign,
  theme,
  setTheme
}: {
  textScale: number;
  setTextScale: Dispatch<SetStateAction<number>>;
  lyricAlign: LyricAlignPreference;
  setLyricAlign: Dispatch<SetStateAction<LyricAlignPreference>>;
  theme: ThemePreference;
  setTheme: Dispatch<SetStateAction<ThemePreference>>;
}) {
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
            Texto
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--on-surface)]">{Math.round(textScale * 100)}%</span>
            <button
              type="button"
              aria-label="Restablecer tamaño de texto"
              onClick={() => setTextScale(1)}
              className="rounded-full bg-[var(--surface-low)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface)]"
            >
              Restablecer
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-label="Disminuir texto"
            onClick={() => setTextScale((value) => Math.max(0.85, Number((value - 0.05).toFixed(2))))}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
          >
            <Minus aria-hidden="true" className="size-4" /> Texto
          </button>
          <button
            type="button"
            aria-label="Aumentar texto"
            onClick={() => setTextScale((value) => Math.min(1.35, Number((value + 0.05).toFixed(2))))}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
          >
            <Plus aria-hidden="true" className="size-4" /> Texto
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
          Alineación
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed={lyricAlign === "center"}
            onClick={() => setLyricAlign("center")}
            className={
              lyricAlign === "center"
                ? "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]"
                : "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
            }
          >
            <AlignCenter aria-hidden="true" className="size-4" /> Centro
          </button>
          <button
            type="button"
            aria-pressed={lyricAlign === "left"}
            onClick={() => setLyricAlign("left")}
            className={
              lyricAlign === "left"
                ? "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]"
                : "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
            }
          >
            <AlignLeft aria-hidden="true" className="size-4" /> Izquierda
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
          Tema
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
            className={
              theme === "light"
                ? "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]"
                : "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
            }
          >
            <Sun aria-hidden="true" className="size-4" /> Claro
          </button>
          <button
            type="button"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
            className={
              theme === "dark"
                ? "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]"
                : "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-low)] text-sm font-bold text-[var(--on-surface)]"
            }
          >
            <Moon aria-hidden="true" className="size-4" /> Oscuro
          </button>
        </div>
      </section>
    </div>
  );
}
