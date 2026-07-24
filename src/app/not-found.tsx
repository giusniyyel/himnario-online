import { OfflineAwareLink } from "@/components/navigation/OfflineAwareLink";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Página no encontrada",
  description: "La página que buscas no existe en el Himnario Rayos de Esperanza.",
  path: "/",
  noIndex: true
});

export default function NotFoundPage() {
  return (
    <div className="space-y-6 py-16 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">Error 404</p>
      <h1 className="text-3xl font-extrabold text-[var(--on-surface)] md:text-4xl">Página no encontrada</h1>
      <p className="mx-auto max-w-md text-sm text-[var(--on-surface-variant)]">
        El enlace puede estar roto o el himno ya no está disponible.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <OfflineAwareLink
          href="/"
          className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--on-accent)]"
        >
          Ir al inicio
        </OfflineAwareLink>
        <OfflineAwareLink
          href="/buscar"
          className="inline-flex rounded-full border border-[var(--outline-variant)] bg-[var(--surface-high)] px-5 py-3 text-sm font-bold text-[var(--on-surface)]"
        >
          Buscar himnos
        </OfflineAwareLink>
      </div>
    </div>
  );
}
