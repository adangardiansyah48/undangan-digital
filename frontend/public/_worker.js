export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/demo41/") || url.pathname === "/favicon.ico" || url.pathname === "/_redirects") {
      return env.ASSETS.fetch(request);
    }
    const accept = request.headers.get("accept") || "";
    const isApi = url.pathname.startsWith("/api/");
    const isAssetExt = /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|ico|json|map)$/i.test(url.pathname);
    if (!isApi && !isAssetExt && (accept.includes("text/html") || url.pathname === "/" || url.pathname === "/login" || url.pathname === "/register" || url.pathname === "/admin" || url.pathname === "/pesan" || url.pathname.startsWith("/example") || url.pathname.startsWith("/katalog") || url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/preview"))) {
      const htmlReq = new Request(new URL("/index.html", request.url), { headers: request.headers });
      return env.ASSETS.fetch(htmlReq);
    }
    if (!isApi && !isAssetExt) {
      const htmlReq = new Request(new URL("/index.html", request.url), { headers: request.headers });
      return env.ASSETS.fetch(htmlReq);
    }
    if (isApi) {
      const target = new URL(request.url);
      target.hostname = "mstory.adangardiansyah48.workers.dev";
      target.protocol = "https:";
      target.port = "";
      const headers = new Headers(request.headers);
      headers.set("x-forwarded-host", url.host);
      headers.delete("host");
      const res = await fetch(new Request(target, { method: request.method, headers, body: request.body, redirect: "manual" }));
      const out = new Headers(res.headers);
      out.delete("content-encoding");
      out.delete("content-length");
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out });
    }
    return env.ASSETS.fetch(request);
  },
};
