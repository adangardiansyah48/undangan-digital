export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = new URL(request.url);
    target.hostname = "mstory.adangardiansyah48.workers.dev";
    target.protocol = "https:";
    target.port = "";
    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", url.host);
    headers.delete("host");
    const res = await fetch(new Request(target, { method: request.method, headers, body: request.body, redirect: "manual" }));
    const outHeaders = new Headers(res.headers);
    outHeaders.delete("content-encoding");
    outHeaders.delete("content-length");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
  },
};
