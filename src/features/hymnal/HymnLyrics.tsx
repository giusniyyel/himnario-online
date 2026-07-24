import type { Hymn } from "@/lib/hymns/types";

const SECTION_LABEL_BASE = "mb-3 text-center text-xs font-extrabold uppercase tracking-[0.18em]";

export function HymnLyrics({ hymn }: { hymn: Hymn }) {
  return (
    <section className="space-y-6">
      {hymn.sections.map((section) => (
        <div
          key={`${section.label}-${section.order}`}
          className={
            section.kind === "chorus"
              ? "rounded-r-2xl border-l-4 border-[var(--secondary-container)] bg-[var(--surface-container)] p-6 text-[var(--on-surface)] shadow-sm"
              : "px-1"
          }
        >
          <h2
            className={`${SECTION_LABEL_BASE} ${
              section.kind === "chorus" ? "text-[var(--secondary)]" : "text-[var(--on-surface-variant)]"
            }`}
          >
            {section.label}
          </h2>
          <p className={`reader-text lyric-font whitespace-pre-line ${section.kind === "chorus" ? "font-semibold" : ""}`}>
            {section.lines.join("\n")}
          </p>
        </div>
      ))}
    </section>
  );
}
