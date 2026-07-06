"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";

export function SearchField({
  name = "q",
  defaultValue = "",
  placeholder = "Buscar por número o título...",
  autoFocus = false,
  formAction = "/buscar",
  hiddenParams = {},
  formClassName
}: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  formAction?: string;
  hiddenParams?: Record<string, string>;
  formClassName?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setValue(defaultValue);
    });
  }, [defaultValue]);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const input = inputRef.current;

    if (!input) {
      return;
    }

    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });

      if (input.value) {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }, [autoFocus, defaultValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmed = value.trim();

    if (trimmed) {
      params.set(name, trimmed);
    }

    for (const [key, paramValue] of Object.entries(hiddenParams)) {
      if (paramValue) {
        params.set(key, paramValue);
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `${formAction}?${queryString}` : formAction);
  }

  return (
    <form action={formAction} className={formClassName} onSubmit={handleSubmit}>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-[var(--highlight)]"
        />
        <input
          ref={inputRef}
          type="search"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          aria-label="Buscar himnos"
          placeholder={placeholder}
          className="search-input h-14 w-full rounded-full border-0 bg-[var(--surface-highest)] py-3 pl-12 pr-12 text-base text-[var(--on-surface)] shadow-sm outline-none ring-1 ring-transparent placeholder:text-[var(--on-surface-variant)] focus:ring-2 focus:ring-[var(--accent)]"
        />
        {value ? (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
