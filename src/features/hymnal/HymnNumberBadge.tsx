import type { Hymn } from "@/lib/hymns/types";

const collectionLabels: Record<Hymn["collection"], string> = {
  normal: "Himno normal",
  special: "Himno especial"
};

const badgeStyles: Record<Hymn["collection"], string> = {
  normal: "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]",
  special: "bg-[var(--secondary-fixed)] text-[var(--on-secondary-fixed)]"
};

const sizes = {
  list: "size-14 text-xl",
  hero: "min-w-14 px-4 py-2 text-xl"
};

export function HymnNumberBadge({ hymn, size = "list" }: { hymn: Hymn; size?: keyof typeof sizes }) {
  return (
    <span
      aria-label={`${collectionLabels[hymn.collection]} ${hymn.number}${hymn.suffix}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${badgeStyles[hymn.collection]}`}
      title={collectionLabels[hymn.collection]}
    >
      {hymn.number}
      {hymn.suffix}
    </span>
  );
}
