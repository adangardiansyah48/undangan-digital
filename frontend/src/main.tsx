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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/new" element={<NewInvitation />} />
        <Route path="/dashboard/invitations/:id" element={<Editor />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/preview/:slug" element={<PublicInvitation preview />} />
        <Route path="/:slug" element={<PublicInvitation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
