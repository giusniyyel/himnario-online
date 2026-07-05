"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { navigateOfflineAware } from "@/lib/offline-navigation";

type OfflineAwareLinkProps = ComponentProps<typeof Link>;

export function OfflineAwareLink({ href, onClick, prefetch = true, ...props }: OfflineAwareLinkProps) {
  const resolvedHref = typeof href === "string" ? href : href.pathname ?? "/";

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch}
      onClick={(event) => {
        navigateOfflineAware(event, resolvedHref);
        onClick?.(event);
      }}
    />
  );
}
