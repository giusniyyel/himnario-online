import type { SearchLyricSnippet } from "@/lib/hymns/types";

export function LyricSearchSnippet({ snippet }: { snippet: SearchLyricSnippet }) {
  return (
    <div className="mt-3 rounded-xl border-l-4 border-[var(--highlight)] bg-[var(--surface-low)] p-3">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
        {snippet.sectionLabel}
      </p>
      <div className="space-y-1 lyric-font text-lg leading-8 text-[var(--on-surface)]">
        {snippet.lines.map((line, lineIndex) => (
          <p key={lineIndex}>
            {line.map((part, partIndex) =>
              part.highlighted ? (
                <mark
                  key={partIndex}
                  className="rounded-md bg-[var(--secondary-container)] px-1 font-semibold text-[var(--on-secondary-fixed)]"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={partIndex}>{part.text}</span>
              )
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
