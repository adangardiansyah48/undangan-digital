import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
export default function Login({ mode }) {
    const nav = useNavigate();
    const isReg = mode === "register";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);
    async function submit(e) {
        e.preventDefault();
        setErr(null);
        setMsg(null);
        if (isReg) {
            const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
            if (error)
                setErr(error.message);
            else
                setMsg("Cek email untuk verifikasi.");
        }
        else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error)
                setErr(error.message);
            else
                nav("/dashboard");
        }
    }
    async function google() { const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/dashboard` } }); if (error)
        setErr(error.message); }
    return (_jsxs("main", { style: { maxWidth: 380, margin: "40px auto", padding: 24 }, children: [_jsx("h1", { children: isReg ? "Daftar" : "Masuk" }), _jsxs("form", { onSubmit: submit, style: { display: "grid", gap: 12, marginTop: 16 }, children: [isReg && _jsx("input", { placeholder: "Nama", value: name, onChange: e => setName(e.target.value), required: true }), _jsx("input", { placeholder: "Email", type: "email", value: email, onChange: e => setEmail(e.target.value), required: true }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: e => setPassword(e.target.value), required: true, minLength: 6 }), _jsx("button", { type: "submit", children: isReg ? "Daftar" : "Masuk" })] }), _jsx("button", { onClick: google, style: { marginTop: 12 }, children: "Google" }), err && _jsx("p", { style: { color: "crimson" }, children: err }), msg && _jsx("p", { children: msg }), _jsx("p", { style: { marginTop: 16 }, children: isReg ? _jsx("a", { href: "/login", children: "Sudah punya akun? Masuk" }) : _jsx("a", { href: "/register", children: "Belum punya akun? Daftar" }) })] }));
}
