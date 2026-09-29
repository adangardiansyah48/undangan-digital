export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    return env.ASSETS.fetch(new URL("/", url.origin));
  },
};
