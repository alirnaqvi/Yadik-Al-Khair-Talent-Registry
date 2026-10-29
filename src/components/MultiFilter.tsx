"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

/** A dropdown of tick boxes. Used for every list-based filter on the dashboard. */
export function MultiFilter({
  icon: Icon,
  label,
  pluralLabel,
  options,
  selected,
  onChange,
}: {
  icon: LucideIcon;
  /** Singular name shown on the button when nothing is chosen, e.g. "Profession". */
  label: string;
  /** Used when several are chosen, e.g. "professions" gives "3 professions". */
  pluralLabel: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  const buttonLabel =
    selected.length === 0
      ? label
      : selected.length === 1
      ? selected[0]
      : `${selected.length} ${pluralLabel}`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Filter by ${label.toLowerCase()}`}
        className={clsx(
          "flex h-11 w-full items-center gap-2 rounded-[10px] border bg-white px-3.5 text-[15px] transition-shadow sm:w-52",
          open
            ? "border-pine-500 ring-4 ring-pine-500/15"
            : "border-pine-200 hover:border-pine-300",
          selected.length > 0 ? "font-semibold text-pine-900" : "text-ink"
        )}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        <span className="flex-1 truncate text-left">{buttonLabel}</span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 animate-pop-in rounded-xl border border-line bg-white p-1.5 shadow-lift sm:right-auto sm:w-72">
          {options.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted">
              Nothing to filter by yet. Options appear once CVs with this detail arrive.
            </p>
          ) : (
            <>
              <ul className="max-h-72 overflow-y-auto">
                {options.map((option) => (
                  <li key={option}>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[15px] text-ink hover:bg-pine-50">
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => toggle(option)}
                        className="checkbox"
                      />
                      <span className="truncate">{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {selected.length > 0 && (
                <div className="mt-1 border-t border-line pt-1">
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-pine-700 hover:bg-pine-50"
                  >
                    Clear {label.toLowerCase()}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
