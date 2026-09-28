import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    let l = document.querySelector('link[rel="icon"]');
    if (l)
        l.href = u;
    let a = document.querySelector('link[rel="apple-touch-icon"]');
    if (a)
        a.href = u;
}).catch(() => { });
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/katalog", element: _jsx(Katalog, {}) }), _jsx(Route, { path: "/pesan", element: _jsx(Order, {}) }), _jsx(Route, { path: "/admin", element: _jsx(Admin, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Login, { mode: "register" }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/dashboard/new", element: _jsx(NewInvitation, {}) }), _jsx(Route, { path: "/dashboard/invitations/:id", element: _jsx(Editor, {}) }), _jsx(Route, { path: "/dashboard/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/preview/:slug", element: _jsx(PublicInvitation, { preview: true }) }), _jsx(Route, { path: "/example", element: _jsx(ContohDesain, {}) }), _jsx(Route, { path: "/:slug", element: _jsx(PublicInvitation, {}) })] }) }) }));
