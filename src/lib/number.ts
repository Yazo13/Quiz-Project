/**
 * Thousands grouping that does not depend on the device locale.
 *
 * `toLocaleString()` reads the runtime's default locale, which on device is
 * whatever the user set in system settings — so the same screen could show
 * "12,408" next to "3 402". Doing it by hand keeps every number in the app
 * consistent with the design, whichever language is selected.
 */
export function group(n: number): string {
  const negative = n < 0;
  const digits = Math.abs(Math.trunc(n)).toString();

  let out = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ',';
    out += digits[i];
  }

  return negative ? `-${out}` : out;
}
