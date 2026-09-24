"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function SettingsClient({
  gdriveConnected,
  userEmail,
}: {
  gdriveConnected: boolean;
  userEmail: string | null;
}) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={userEmail ?? ""} readOnly />
          </div>
          <p className="text-xs text-muted-foreground">
            Ganti password lewat email recovery dari Supabase Auth.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Google Drive — penyimpanan foto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Foto galeri undangan disimpan ke Google Drive kamu. Storage lebih besar daripada Supabase Storage gratis.
          </p>
          {gdriveConnected ? (
            <p className="text-sm font-medium text-foreground">Terhubung ✓</p>
          ) : (
            <p className="text-sm text-muted-foreground">Belum terhubung.</p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={async () => {
                setMsg(null);
                const res = await fetch("/api/auth/gdrive/auth-url");
                const { url, error } = await res.json();
                if (error) setMsg(error);
                else window.location.href = url as string;
              }}
            >
              Hubungkan Google Drive
            </Button>
            {gdriveConnected && (
              <form action="/api/auth/gdrive/disconnect" method="post">
                <Button type="submit" size="sm" variant="outline">
                  Putuskan
                </Button>
              </form>
            )}
          </div>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
