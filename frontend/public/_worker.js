export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/demo41/") || url.pathname === "/favicon.ico") {
      return env.ASSETS.fetch(request);
    }
    if (url.pathname.startsWith("/api/")) {
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
    const isAssetExt = /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|ico|json|map)$/i.test(url.pathname);
    if (!isAssetExt) {
      const htmlReq = new Request(new URL("/index.html", request.url), { headers: request.headers });
      return env.ASSETS.fetch(htmlReq);
    }
    return env.ASSETS.fetch(request);
  },
};
