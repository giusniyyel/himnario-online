"use client";

import { ReadingSettingsControls } from "./ReadingSettingsControls";
import { useReadingPreferences } from "./use-reading-preferences";

export function ConfigurationPage() {
  const preferences = useReadingPreferences();

  return (
    <div className="space-y-7">
      <header className="space-y-3 py-2">
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[var(--accent)]">
          Configuración
        </h1>
        <div className="h-1 w-20 rounded-full bg-[var(--secondary-container)]" />
        <p className="text-sm text-[var(--on-surface-variant)]">
          Estos ajustes se guardan en este dispositivo y se aplican a todos los himnos.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-4 shadow-sm md:p-5">
        <ReadingSettingsControls {...preferences} />
      </section>
    </div>
  );
}
