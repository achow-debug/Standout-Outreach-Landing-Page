"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from "react";

type MultiSelectFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Ref attached to the visible interactive control (desktop trigger / touch select). */
  controlRef?: Ref<HTMLButtonElement | HTMLSelectElement | null>;
};

function toggleValue(current: string[], option: string): string[] {
  if (current.includes(option)) {
    return current.filter((item) => item !== option);
  }
  return [...current, option];
}

export function MultiSelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  helper,
  error,
  required = false,
  disabled = false,
  controlRef,
}: MultiSelectFieldProps) {
  const listboxId = useId();
  const labelId = `${id}-label`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement>(null);

  const displayText =
    value.length > 0 ? value.join(", ") : "Select all that apply";

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!controlRef) return;
    // Prefer the native select on coarse pointers; the button otherwise.
    // Assign after mount so both refs exist.
    const assign = () => {
      const isCoarse =
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches;
      const node = isCoarse ? nativeSelectRef.current : triggerRef.current;
      if (typeof controlRef === "function") {
        controlRef(node);
      } else {
        controlRef.current = node;
      }
    };
    assign();
  }, [controlRef]);

  function handleNativeChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(event.target.selectedOptions).map(
      (option) => option.value,
    );
    onChange(selected);
  }

  function handleCheckboxChange(option: string) {
    onChange(toggleValue(value, option));
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!disabled) setOpen((prev) => !prev);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (!rootRef.current?.contains(next)) {
      setOpen(false);
    }
  }

  return (
    <div
      className={`field${error ? " field--error" : ""}`}
      ref={rootRef}
      onBlur={handleBlur}
    >
      <label id={labelId} htmlFor={id}>
        {label}
      </label>

      {/* Touch: native multi-select over a styled display */}
      <div className="relative hidden [@media(pointer:coarse)]:block">
        <div
          className="pointer-events-none flex min-h-12 items-center rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink"
          aria-hidden="true"
        >
          <span className={value.length === 0 ? "text-muted" : undefined}>
            {displayText}
          </span>
        </div>
        <select
          ref={nativeSelectRef}
          id={id}
          name={name}
          multiple
          value={value}
          onChange={handleNativeChange}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: custom checkbox dropdown */}
      <div className="relative block [@media(pointer:coarse)]:hidden">
        <button
          ref={triggerRef}
          type="button"
          id={`${id}-trigger`}
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-describedby={describedBy}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left text-base text-ink transition-[background-color,border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(79_49_146_/_22%)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className={value.length === 0 ? "text-muted" : undefined}>
            {displayText}
          </span>
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 text-ink transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open ? (
          <fieldset
            id={listboxId}
            className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-soft)]"
          >
            <legend className="sr-only">{label}</legend>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {options.map((option) => {
                const optionId = `${id}-opt-${option.replace(/\s+/g, "-").toLowerCase()}`;
                const checked = value.includes(option);
                return (
                  <li key={option}>
                    <label
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-ink hover:bg-brand-tint focus-within:bg-brand-tint"
                    >
                      <input
                        id={optionId}
                        type="checkbox"
                        name={`${name}[]`}
                        value={option}
                        checked={checked}
                        onChange={() => handleCheckboxChange(option)}
                        className="size-4 shrink-0 accent-brand"
                      />
                      <span>{option}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ) : null}
      </div>

      {helper ? (
        <p id={helperId} className="field-hint">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
