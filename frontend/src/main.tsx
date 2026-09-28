import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Katalog from "./pages/Katalog";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewInvitation from "./pages/NewInvitation";
import Editor from "./pages/Editor";
import PublicInvitation from "./pages/PublicInvitation";
import Settings from "./pages/Settings";
import ContohDesain from "./pages/ContohDesain";
import Order from "./pages/Order";
import Admin from "./pages/Admin";
import { getLogoUrl } from "./lib/site";
getLogoUrl().then((u) => {
  let l = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (l) l.href = u;
  let a = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (a) a.href = u;
}).catch(() => {});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/pesan" element={<Order />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/new" element={<NewInvitation />} />
        <Route path="/dashboard/invitations/:id" element={<Editor />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/preview/:slug" element={<PublicInvitation preview />} />
        <Route path="/example" element={<ContohDesain />} />
        <Route path="/:slug" element={<PublicInvitation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
