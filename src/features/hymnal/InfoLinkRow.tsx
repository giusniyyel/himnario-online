import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function InfoLinkRow({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] px-3.5 py-3.5 transition hover:bg-[var(--surface-low)] active:scale-[0.99]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--accent)]">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-extrabold text-[var(--on-surface)]">{label}</span>
      <ChevronRight
        aria-hidden="true"
        className="size-5 shrink-0 text-[var(--on-surface-variant)] transition group-hover:translate-x-0.5"
      />
    </Link>
  );
}
