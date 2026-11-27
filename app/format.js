// Small formatting helpers shared by the views: money, discount math,
// check-time rendering and the verdict wording shown on every deal card.

export const usd = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const pctOff = (d) => Math.round((1 - d.price / d.was) * 100);

export const saved = (d) => d.was - d.price;

export function checkedLabel(iso) {
  const dt = new Date(iso);
  const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Jakarta" });
  const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Jakarta" });
  return `${date}, ${time} WIB`;
}

export const VERDICTS = {
  "new-low": { label: "Real deal — new low", tone: "hot" },
  strong: { label: "Strong deal", tone: "good" },
  good: { label: "Good deal", tone: "ok" },
  routine: { label: "Routine sale", tone: "flat" },
};

export function verdictOf(d) {
  return VERDICTS[d.verdict] ?? VERDICTS.good;
}

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
