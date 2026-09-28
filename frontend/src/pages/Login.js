import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSiteLogo } from "../lib/site";
export default function Login({ mode }) {
    const nav = useNavigate();
    const isReg = mode === "register";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const logo = useSiteLogo();
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
                setMsg("Cek email untuk verifikasi. Lalu login.");
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
    const input = { width: "100%", padding: "12px 14px", borderRadius: 999, border: "1px solid #ebe8e3", fontSize: 14, background: "#fff" };
    return (_jsxs("div", { style: { minHeight: "100svh", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif", display: "grid", placeItems: "center", padding: 16 }, children: [_jsx("style", { children: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');` }), _jsxs("div", { style: { width: "100%", maxWidth: 420 }, children: [_jsx("div", { style: { display: "flex", justifyContent: "center", marginBottom: 18 }, children: _jsx("img", { src: logo, alt: "mstory.id", style: { height: 44, width: "auto" } }) }), _jsxs("div", { style: { background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 20, boxShadow: "0 12px 32px rgba(28,49,71,.06)" }, children: [_jsx("h1", { style: { fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "0 0 16px", color: "#1c3147", textAlign: "center" }, children: isReg ? "Daftar Akun" : "Masuk" }), _jsxs("form", { onSubmit: submit, style: { display: "grid", gap: 12 }, children: [isReg && _jsx("input", { placeholder: "Nama lengkap", value: name, onChange: (e) => setName(e.target.value), required: true, style: input }), _jsx("input", { placeholder: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: input }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, style: input }), _jsx("button", { type: "submit", disabled: loading, style: { padding: "12px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }, children: loading ? "Memproses…" : isReg ? "Daftar" : "Masuk" })] }), err && _jsx("p", { style: { color: "#dc2626", fontSize: 13, marginTop: 12, textAlign: "center" }, children: err }), msg && _jsx("p", { style: { color: "#0a7", fontSize: 13, marginTop: 12, textAlign: "center" }, children: msg })] })] })] }));
}
