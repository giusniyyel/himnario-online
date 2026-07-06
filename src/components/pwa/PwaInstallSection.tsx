"use client";

import { Download, Share } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeNoop() {
  return () => {};
}

function getDetectedInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getShowIosHint(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !getDetectedInstalled();
}

export function PwaInstallSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installAccepted, setInstallAccepted] = useState(false);
  const [installMessage, setInstallMessage] = useState<string | null>(null);
  const detectedInstalled = useSyncExternalStore(subscribeNoop, getDetectedInstalled, () => false);
  const showIosHint = useSyncExternalStore(subscribeNoop, getShowIosHint, () => false);
  const isInstalled = detectedInstalled || installAccepted;

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallMessage("La app se está instalando en tu dispositivo.");
      setInstallAccepted(true);
    }

    setDeferredPrompt(null);
  }

  if (isInstalled) {
    return (
      <section className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-4 shadow-sm md:p-5">
        <h2 className="text-lg font-extrabold text-[var(--on-surface)]">App instalada</h2>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
          Ya estás usando Himnario Rayos de Esperanza como app en este dispositivo.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] p-4 shadow-sm md:p-5">
      <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Instalar app</h2>
      <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
        Instálala en tu pantalla de inicio para usarla sin conexión durante el culto.
      </p>

      {deferredPrompt ? (
        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-extrabold text-[var(--on-accent)] transition hover:brightness-110 active:scale-[0.98]"
        >
          <Download aria-hidden="true" className="size-4" />
          Instalar en este dispositivo
        </button>
      ) : null}

      {showIosHint ? (
        <div className="mt-4 rounded-xl bg-[var(--surface-low)] p-4 text-sm text-[var(--on-surface-variant)]">
          <p className="inline-flex items-center gap-2 font-bold text-[var(--on-surface)]">
            <Share aria-hidden="true" className="size-4" />
            En iPhone o iPad
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Toca el botón Compartir en Safari.</li>
            <li>Elige “Agregar a pantalla de inicio”.</li>
            <li>Confirma con “Agregar”.</li>
          </ol>
        </div>
      ) : null}

      {!deferredPrompt && !showIosHint ? (
        <p className="mt-4 text-sm text-[var(--on-surface-variant)]">
          Abre el menú del navegador y busca la opción “Instalar app” o “Agregar a pantalla de inicio”.
        </p>
      ) : null}

      {installMessage ? <p className="mt-3 text-sm font-semibold text-[var(--accent)]">{installMessage}</p> : null}
    </section>
  );
}
