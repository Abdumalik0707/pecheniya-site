/**
 * Phone numbers are stored as "+998901234567", but older accounts were saved
 * with a space ("+998 901234567"). Always look an account up by every form.
 */
export function normalizePhone(raw: unknown): string {
  return String(raw ?? "").replace(/\s/g, "");
}

export function phoneVariants(raw: unknown): string[] {
  const clean = normalizePhone(raw);
  const m = clean.match(/^(\+998)(\d{9})$/);
  return m ? [clean, `${m[1]} ${m[2]}`] : [clean];
}
