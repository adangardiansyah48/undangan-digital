import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
export default function Login({ mode }) {
    const nav = useNavigate();
    const isReg = mode === "register";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    async function submit(e) {
        e.preventDefault();
        setErr(null);
        setMsg(null);
        setLoading(true);
        try {
            if (isReg) {
                const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
                if (error)
                    throw error;
                setMsg("Cek email untuk verifikasi. Lalu login sebagai admin.");
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
                nav("/admin");
            }
        }
        catch (e2) {
            setErr(e2.message);
        }
        finally {
            setLoading(false);
        }
    }
    async function google() {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/admin` } });
        if (error)
            setErr(error.message);
    }
    const input = { width: "100%", padding: "12px 14px", borderRadius: 999, border: "1px solid #ebe8e3", fontSize: 14, background: "#fff" };
    return (_jsxs("div", { style: { minHeight: "100svh", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif", display: "grid", placeItems: "center", padding: 16 }, children: [_jsx("style", { children: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');` }), _jsxs("div", { style: { width: "100%", maxWidth: 420 }, children: [_jsxs(Link, { to: "/", style: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifyContent: "center", marginBottom: 18 }, children: [_jsx("img", { src: "/logo.svg", alt: "mstory.id", style: { height: 38, width: "auto" } }), _jsx("span", { style: { fontSize: 10, background: "#1c3147", color: "#fff", borderRadius: 999, padding: "4px 8px", letterSpacing: ".12em", fontWeight: 600 }, children: "ADMIN" })] }), _jsxs("div", { style: { background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 20, boxShadow: "0 12px 32px rgba(28,49,71,.06)" }, children: [_jsx("p", { style: { fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700, textAlign: "center" }, children: "MSTORE ADMIN" }), _jsx("h1", { style: { fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "6px 0 4px", color: "#1c3147", textAlign: "center" }, children: isReg ? "Daftar Akun" : "Masuk Admin" }), _jsx("p", { style: { margin: "0 0 16px", color: "#6b7280", fontSize: 13, textAlign: "center" }, children: isReg ? "Buat akun, nanti set role admin di Supabase." : "Login untuk kelola pesanan katalog 60." }), _jsxs("form", { onSubmit: submit, style: { display: "grid", gap: 12 }, children: [isReg && _jsx("input", { placeholder: "Nama lengkap", value: name, onChange: (e) => setName(e.target.value), required: true, style: input }), _jsx("input", { placeholder: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: input }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, style: input }), _jsx("button", { type: "submit", disabled: loading, style: { padding: "12px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }, children: loading ? "Memproses…" : isReg ? "Daftar" : "Masuk" })] }), _jsx("button", { onClick: google, style: { marginTop: 10, width: "100%", padding: "11px", borderRadius: 999, border: "1px solid #ebe8e3", background: "#fff", color: "#1c3147", fontWeight: 600, cursor: "pointer" }, children: "Masuk dengan Google" }), err && _jsx("p", { style: { color: "#dc2626", fontSize: 13, marginTop: 12, textAlign: "center" }, children: err }), msg && _jsx("p", { style: { color: "#0a7", fontSize: 13, marginTop: 12, textAlign: "center" }, children: msg }), _jsxs("p", { style: { marginTop: 16, fontSize: 13, textAlign: "center", color: "#6b7280" }, children: [isReg ? _jsx(_Fragment, { children: _jsx(Link, { to: "/login", style: { color: "#1c3147", fontWeight: 600 }, children: "Sudah punya akun? Masuk" }) }) : _jsx(_Fragment, { children: _jsx(Link, { to: "/register", style: { color: "#1c3147", fontWeight: 600 }, children: "Belum punya akun? Daftar" }) }), _jsx("span", { style: { margin: "0 8px", color: "#ddd" }, children: "\u00B7" }), _jsx(Link, { to: "/", style: { color: "#6b7280" }, children: "Katalog" })] })] }), _jsx("p", { style: { textAlign: "center", fontSize: 11, color: "#9aa", marginTop: 14 }, children: "Harga by WA \u00B7 Guest order tanpa login \u00B7 Admin kelola di /admin" })] })] }));
}
