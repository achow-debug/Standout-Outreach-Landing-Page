"use client";

import type { ChangeEvent, Ref } from "react";

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  selectRef?: Ref<HTMLSelectElement>;
};

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  selectRef,
}: SelectFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        ref={selectRef}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={errorId}
        className="text-base"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
