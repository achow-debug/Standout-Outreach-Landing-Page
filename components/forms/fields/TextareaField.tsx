"use client";

import type { ChangeEvent, Ref } from "react";
import { MAX_WORDS } from "@/lib/forms/config";
import { countWords } from "@/lib/forms/validation";

type TextareaFieldProps = {
  id: string;
  name: string;
  /** Primary label text. When required (Other), becomes "Please specify". */
  label: string;
  /** When true, show "(optional)" in muted text after the label. */
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  textareaRef?: Ref<HTMLTextAreaElement>;
};

export function TextareaField({
  id,
  name,
  label,
  optional = false,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  textareaRef,
}: TextareaFieldProps) {
  const words = countWords(value);
  const overLimit = words > MAX_WORDS;
  const helperId = `${id}-counter`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={`field${error || overLimit ? " field--error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-ink-muted">(optional)</span>
        ) : null}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        rows={5}
        required={required}
        disabled={disabled}
        aria-invalid={error || overLimit ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className="text-base"
      />
      <p
        id={helperId}
        className={`field-hint${overLimit ? " !text-[var(--color-error)] font-semibold" : ""}`}
        aria-live="polite"
      >
        {words} / {MAX_WORDS} words
      </p>
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
