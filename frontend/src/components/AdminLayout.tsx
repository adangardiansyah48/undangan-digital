import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
export function useLogo() {
  const [logo, setLogo] = useState<string>("/logo.svg");
  useEffect(() => {
    supabase.from("site_settings").select("value").eq("id", "logo_url").maybeSingle().then(({ data }) => { if (data?.value) setLogo(data.value); });
  }, []);
  return logo;
}
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const logo = useLogo();
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)); }, []);
  const items = [
    { to: "/admin", label: "Pesanan", icon: "◧" },
    { to: "/dashboard", label: "Invitations", icon: "✎" },
    { to: "/dashboard/settings", label: "Pengaturan", icon: "⚙" },
  ];
  const isActive = (to: string) => loc.pathname === to || (to !== "/admin" && loc.pathname.startsWith(to));
  return (
    <div style={{ minHeight: "100svh", display: "flex", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #ebe8e3", display: open ? "flex" : "none" as unknown as string, flexDirection: "column", position: "fixed", inset: 0, zIndex: 30 } as React.CSSProperties} className="admin-sidebar">
        <div style={{ padding: 16, borderBottom: "1px solid #ebe8e3", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="mstory.id" style={{ height: 32, width: "auto" }} />
          <span style={{ fontSize: 11, color: "#6b7280" }}>{email ?? ""}</span>
          <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", border: "1px solid #ddd", borderRadius: 8, padding: "4px 8px", background: "#fff" }}>✕</button>
        </div>
        <nav style={{ padding: 12, display: "grid", gap: 6, flex: 1 }}>
          {items.map((it) => (
            <Link key={it.to} to={it.to} onClick={() => setOpen(false)} style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", display: "flex", gap: 10, alignItems: "center", background: isActive(it.to) ? "#1c3147" : "transparent", color: isActive(it.to) ? "#fff" : "#1c3147", fontWeight: isActive(it.to) ? 700 : 400, border: isActive(it.to) ? "1px solid #1c3147" : "1px solid transparent" }}>
              <span>{it.icon}</span> {it.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid #ebe8e3", display: "grid", gap: 8 }}>
          <Link to="/" style={{ textAlign: "center", padding: "8px", borderRadius: 999, border: "1px solid #ebe8e3", textDecoration: "none", color: "#6b7280", fontSize: 13 }}>Katalog</Link>
          <button onClick={async () => { await supabase.auth.signOut(); nav("/login"); }} style={{ padding: "8px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 }}>Keluar</button>
        </div>
      </aside>
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #ebe8e3", display: "flex", flexDirection: "column", minHeight: "100svh" }} className="admin-sidebar-desktop">
        <div style={{ padding: "16px 14px", borderBottom: "1px solid #ebe8e3", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="mstory.id" style={{ height: 32, width: "auto" }} />
        </div>
        <nav style={{ padding: 12, display: "grid", gap: 6, flex: 1 }}>
          {items.map((it) => (
            <Link key={it.to} to={it.to} style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", display: "flex", gap: 10, alignItems: "center", background: isActive(it.to) ? "#1c3147" : "transparent", color: isActive(it.to) ? "#fff" : "#1c3147", fontWeight: isActive(it.to) ? 700 : 400, border: isActive(it.to) ? "1px solid #1c3147" : "1px solid transparent" }}>
              <span>{it.icon}</span> {it.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid #ebe8e3", display: "grid", gap: 8 }}>
          <div style={{ fontSize: 11, color: "#9aa", wordBreak: "break-all" }}>{email ?? ""}</div>
          <Link to="/" style={{ textAlign: "center", padding: "8px", borderRadius: 999, border: "1px solid #ebe8e3", textDecoration: "none", color: "#6b7280", fontSize: 13 }}>Katalog</Link>
          <button onClick={async () => { await supabase.auth.signOut(); nav("/login"); }} style={{ padding: "8px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 }}>Keluar</button>
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#fff", borderBottom: "1px solid #ebe8e3", padding: "10px 16px", display: "none" }} className="admin-mobile-bar">
          <button onClick={() => setOpen(true)} style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid #ddd", background: "#fff" }}>☰ Menu</button>
        </div>
        <div style={{ padding: "18px 16px 40px", maxWidth: 1100 }}>{children}</div>
      </div>
      <style>{`@media(max-width:820px){ .admin-sidebar-desktop{display:none!important} .admin-mobile-bar{display:flex!important} } @media(min-width:821px){ aside.admin-sidebar{display:none!important} }`}</style>
    </div>
  );
}
