import type { LucideIcon } from "lucide-react";

export function InfoStatTile({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--surface-container)] text-[var(--accent)]">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="mt-3 block text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
        {label}
      </span>
      <span className="mt-1 block text-sm font-extrabold leading-snug text-[var(--on-surface)]">{value}</span>
    </>
  );

  const className =
    "rounded-xl bg-[var(--surface-low)] p-3.5 text-left transition hover:brightness-[0.98] active:scale-[0.99]";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
        <span className="sr-only"> (abre en una pestaña nueva)</span>
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
