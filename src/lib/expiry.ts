import type { InvitationData } from "@/types/database";

export function eventDate(inv: { data: InvitationData; expired_at: string | null }): Date | null {
  if (inv.expired_at) {
    const d = new Date(inv.expired_at);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const dates = (inv.data.events ?? [])
    .map((e) => e.date)
    .filter(Boolean)
    .map((d) => new Date(d + "T00:00:00Z"))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  return dates[0] ?? null;
}

export function expiryFromEvent(eventISO: string | null, daysAfter = 10): string | null {
  if (!eventISO) return null;
  const base = new Date(eventISO.includes("T") ? eventISO : eventISO + "T00:00:00Z");
  if (Number.isNaN(base.getTime())) return null;
  const d = new Date(base);
  d.setDate(d.getDate() + daysAfter);
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

export function isExpired(expiredAt: string | null): boolean {
  if (!expiredAt) return false;
  return new Date(expiredAt).getTime() <= Date.now();
}
