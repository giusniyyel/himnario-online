import { Heart } from "lucide-react";
import { appInfo } from "@/lib/app-info";

export function CongregationCard() {
  return (
    <section className="rounded-2xl bg-[var(--primary)] p-4 text-[var(--on-primary)] shadow-sm md:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Heart aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white/75">Congregación</p>
          <p className="mt-1 text-sm font-semibold leading-snug">{appInfo.congregationNote}</p>
        </div>
      </div>
    </section>
  );
}
