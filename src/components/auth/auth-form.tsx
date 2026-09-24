"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (err) throw err;
        setInfo("Cek email untuk verifikasi, atau langsung masuk jika konfirmasi dimatikan.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal autentikasi");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (err) setError(err.message);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm text-primary-foreground">
          I
        </span>
        {APP_NAME}
      </Link>
      <h1 className="text-center text-2xl font-semibold">
        {mode === "login" ? "Masuk" : "Buat akun"}
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Lanjut ke dashboard undangan." : "Mulai bikin undangan dalam menit."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Nama lengkap"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="kamu@email.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {info && <p className="text-sm text-muted-foreground">{info}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
        </Button>
      </form>

      <Button variant="outline" className="mt-3 w-full" onClick={google}>
        Lanjut dengan Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Belum punya akun?{" "}
            <Link href="/register" className="text-foreground underline">
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/login" className="text-foreground underline">
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
