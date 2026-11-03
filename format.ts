/** Formats whole dinars, e.g. 1500 -> "1,500 دج". Integers only, so no float issues. */
export function formatDZD(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} دج`;
}
