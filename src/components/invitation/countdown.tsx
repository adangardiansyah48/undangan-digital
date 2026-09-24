"use client";

import { useEffect, useState } from "react";

type Unit = { label: string; value: number };

function getUnits(targetIso: string): Unit[] {
  const diff = new Date(targetIso).getTime() - Date.now();
  const d = Math.max(0, diff);
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((d % (1000 * 60)) / 1000);
  return [
    { label: "Hari", value: days },
    { label: "Jam", value: hrs },
    { label: "Menit", value: mins },
    { label: "Detik", value: secs },
  ];
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const [units, setUnits] = useState<Unit[]>(() => getUnits(targetIso));

  useEffect(() => {
    const id = setInterval(() => setUnits(getUnits(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {units.map((u) => (
        <div key={u.label} className="rounded-2xl bg-muted px-2 py-4">
          <p className="text-xl font-semibold tabular-nums">{String(u.value).padStart(2, "0")}</p>
          <p className="text-[11px] text-muted-foreground">{u.label}</p>
        </div>
      ))}
    </div>
  );
}
