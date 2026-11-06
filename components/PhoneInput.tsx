"use client";

import type { InputHTMLAttributes } from "react";

/** "+998901234567" — the "+998" prefix is fixed, only digits are accepted after it, no spaces. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const rest = (digits.startsWith("998") ? digits.slice(3) : digits).slice(0, 9);
  return "+998" + rest;
}

/** True when all 9 digits after +998 are filled in. */
export function isCompletePhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 12;
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value: string;
  onValueChange: (formatted: string) => void;
};

const PREFIX_LEN = 4; // "+998"

// the prefix is fixed: never let the caret sit in front of it
function keepCaretAfterPrefix(el: HTMLInputElement) {
  const start = el.selectionStart ?? 0;
  if (start < PREFIX_LEN && el.selectionEnd === start) {
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }
}

/** Phone field: letters and symbols are dropped as you type, "+998" can't be deleted. */
export function PhoneInput({ value, onValueChange, ...props }: Props) {
  return (
    <input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete={props.autoComplete ?? "tel"}
      maxLength={13}
      value={value}
      placeholder={props.placeholder ?? "+998901234567"}
      onChange={(e) => onValueChange(formatPhone(e.target.value))}
      onFocus={(e) => {
        props.onFocus?.(e);
        const el = e.currentTarget;
        requestAnimationFrame(() => keepCaretAfterPrefix(el));
      }}
      onClick={(e) => {
        props.onClick?.(e);
        keepCaretAfterPrefix(e.currentTarget);
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        // block anything that isn't a digit, "+" or an editing/navigation key
        if (e.key.length === 1 && !/[0-9+]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          return;
        }
        if (/^[0-9]$/.test(e.key)) keepCaretAfterPrefix(e.currentTarget);
      }}
    />
  );
}
