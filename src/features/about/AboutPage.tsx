import Link from "next/link";
import { BookOpen, Code2, Info, MonitorSmartphone } from "lucide-react";
import { settingsCardClassName } from "@/features/hymnal/settings-card";
import { appInfo } from "@/lib/app-info";
import { site } from "@/lib/site-metadata";
import { CongregationCard } from "./CongregationCard";
import { InfoStatTile } from "./InfoStatTile";

export function AboutPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 py-2 text-center">
        <h1 className="text-2xl font-extrabold leading-tight text-[var(--accent)] md:text-3xl">{site.name}</h1>
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)] md:text-xs">
          {site.organization}
        </p>
        <p className="pt-1">
          <span className="inline-flex rounded-full border border-[var(--outline-variant)] bg-[var(--surface-low)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">
            Versión {appInfo.version}
          </span>
        </p>
      </header>

      <blockquote className="rounded-xl border-l-2 border-[var(--secondary-container)] bg-[var(--surface-low)] px-4 py-3 text-sm italic leading-relaxed text-[var(--on-surface-variant)]">
        “{appInfo.scriptureQuote.text}”
        <footer className="mt-1 not-italic">— {appInfo.scriptureQuote.reference}</footer>
      </blockquote>

      <section className={settingsCardClassName}>
        <div className="space-y-2">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
            El proyecto
          </h2>
          <p className="text-sm leading-relaxed text-[var(--on-surface-variant)]">{appInfo.mission}</p>
          <p className="text-sm text-[var(--on-surface-variant)]/80">{appInfo.communityNote}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <InfoStatTile icon={Info} label="Versión" value={`v${appInfo.version}`} />
        <InfoStatTile
          icon={Code2}
          label="Desarrollo"
          value={appInfo.author.displayName}
          href={appInfo.author.url}
        />
        <InfoStatTile icon={MonitorSmartphone} label="Compatibilidad" value={appInfo.compatibility} />
        <InfoStatTile icon={BookOpen} label="Contenido" value={`${appInfo.hymnCount} himnos`} />
      </div>

      <CongregationCard />

      <p className="text-center text-sm text-[var(--on-surface-variant)]">
        <Link href={appInfo.legal.termsPath} className="font-bold text-[var(--accent)] underline-offset-4 hover:underline">
          Términos de uso
        </Link>
        {" · "}
        <Link
          href={appInfo.legal.privacyPath}
          className="font-bold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Política de privacidad
        </Link>
      </p>
    </div>
  );
}
