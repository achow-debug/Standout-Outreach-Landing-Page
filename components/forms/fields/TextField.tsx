"use client";

import type { ChangeEvent, Ref } from "react";

type TextFieldKind = "email" | "text" | "website";

type TextFieldProps = {
  kind: TextFieldKind;
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
};

const KIND_ATTRS: Record<
  TextFieldKind,
  {
    type: "email" | "text";
    inputMode?: "email" | "url" | "text";
    autoComplete: string;
    autoCapitalize: string;
    spellCheck: boolean;
    enterKeyHint?: "next" | "done";
  }
> = {
  email: {
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    autoCapitalize: "none",
    spellCheck: false,
    enterKeyHint: "next",
  },
  text: {
    type: "text",
    autoComplete: "name",
    autoCapitalize: "words",
    spellCheck: true,
    enterKeyHint: "next",
  },
  website: {
    type: "text",
    inputMode: "url",
    autoComplete: "url",
    autoCapitalize: "none",
    spellCheck: false,
  },
};

export function TextField({
  kind,
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  helper,
  error,
  required = false,
  disabled = false,
  inputRef,
}: TextFieldProps) {
  const attrs = KIND_ATTRS[kind];
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={attrs.type}
        inputMode={attrs.inputMode}
        autoComplete={attrs.autoComplete}
        autoCapitalize={attrs.autoCapitalize}
        spellCheck={attrs.spellCheck}
        enterKeyHint={attrs.enterKeyHint}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className="text-base"
      />
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
