"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Heart, Share2 } from "lucide-react";
import type { Hymn } from "@/lib/hymns/types";
import {
  addRecent,
  readUserSettings,
  toggleFavorite,
} from "@/services/local-storage/user-preferences";
import { useReadingPreferences } from "./use-reading-preferences";

export function HymnReaderClient({ hymn }: { hymn: Hymn }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  useReadingPreferences();
  const isFavorite = favoriteIds.includes(hymn.id);
  const lyricsText = useMemo(
    () =>
      `${hymn.number}${hymn.suffix} ${hymn.displayTitle}\n\n${hymn.sections
        .map((section) => `${section.label}\n${section.lines.join("\n")}`)
        .join("\n\n")}`,
    [hymn]
  );

  useEffect(() => {
    addRecent(hymn.id);
    queueMicrotask(() => {
      setFavoriteIds(readUserSettings().favoriteIds);
    });
  }, [hymn.id]);

  function onToggleFavorite() {
    setFavoriteIds(toggleFavorite(hymn.id));
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: hymn.displayTitle,
          text: `${hymn.number}${hymn.suffix} ${hymn.displayTitle}`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("No se pudo compartir el himno", error);
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(lyricsText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch (error) {
      console.error("No se pudo copiar la letra", error);
    }
  }

  return (
    <div className="border-t border-[var(--outline-variant)] pt-6">
      <section aria-label="Acciones del himno" className="flex items-center justify-center gap-2">
        <ReaderActionButton icon={<Share2 aria-hidden="true" className="size-[18px]" />} label="Compartir" onClick={onShare} />
        <ReaderActionButton
          icon={
            <Heart
              aria-hidden="true"
              className={`size-[18px] ${isFavorite ? "fill-[var(--secondary-container)] text-[var(--secondary)]" : ""}`}
            />
          }
          label="Favorito"
          onClick={onToggleFavorite}
          pressed={isFavorite}
        />
        <ReaderActionButton
          icon={
            copyState === "copied" ? (
              <Check aria-hidden="true" className="size-[18px] text-[var(--secondary)]" />
            ) : (
              <Copy aria-hidden="true" className="size-[18px]" />
            )
          }
          label={copyState === "copied" ? "Copiado" : "Copiar"}
          liveLabel={copyState === "copied" ? "Letra copiada al portapapeles" : undefined}
          onClick={onCopy}
        />
      </section>
    </div>
  );
}

function ReaderActionButton({
  icon,
  label,
  liveLabel,
  onClick,
  pressed,
}: {
  icon: ReactNode;
  label: string;
  liveLabel?: string;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-low)] hover:text-[var(--on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      {icon}
      {label}
      {liveLabel ? (
        <span className="sr-only" role="status" aria-live="polite">
          {liveLabel}
        </span>
      ) : null}
    </button>
  );
}
