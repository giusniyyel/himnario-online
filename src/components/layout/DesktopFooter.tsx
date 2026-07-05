export function DesktopFooter() {
  return (
    <footer className="hidden w-full border-t border-[var(--outline-variant)] py-6 text-center text-sm text-[var(--on-surface-variant)] lg:block">
      <div className="mx-auto w-full max-w-[640px] px-10">
        Hecho por{" "}
        <a
          href="https://www.giusniyyel.dev/"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[var(--on-surface)] underline-offset-4 transition-colors hover:text-[var(--secondary)] hover:underline focus-visible:outline-none focus-visible:underline focus-visible:text-[var(--secondary)]"
        >
          Daniel Campos
          <span className="sr-only"> (abre en una pestaña nueva)</span>
        </a>
      </div>
    </footer>
  );
}