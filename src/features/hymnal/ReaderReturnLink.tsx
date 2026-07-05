"use client";

import { OfflineAwareLink } from "@/components/navigation/OfflineAwareLink";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { navigateOfflineAware } from "@/lib/offline-navigation";
import {
  canUseReturnHistory,
  clearReturnNavigationIntent,
  type ReturnNavigationSource
} from "@/services/local-storage/return-navigation";

export type HymnReturnTarget = {
  href: string;
  label: string;
  source: ReturnNavigationSource | "collection";
  preferHistory: boolean;
};

export function ReaderReturnLink({ target }: { target: HymnReturnTarget }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();
  const currentHref = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;

  return (
    <OfflineAwareLink
      href={target.href}
      aria-label={`Volver a ${target.label}`}
      onClick={(event) => {
        if (navigateOfflineAware(event, target.href)) {
          return;
        }

        if (
          !target.preferHistory ||
          target.source === "collection" ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        if (!canUseReturnHistory(currentHref, target.source)) {
          return;
        }

        event.preventDefault();
        clearReturnNavigationIntent();
        router.back();
      }}
      className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-high)] px-4 py-2 text-sm font-bold text-[var(--accent)]"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {target.label}
    </OfflineAwareLink>
  );
}
