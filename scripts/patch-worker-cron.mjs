import fs from "node:fs";
const p = ".open-next/worker.js";
let s = fs.readFileSync(p, "utf8");
if (!s.includes("scheduled")) {
  s = s.replace(
    "export default {",
    `async scheduled(event, env, ctx) { ctx.waitUntil(fetch(new Request("https://invora/_cron/cleanup", { headers: { authorization: "Bearer " + (env.CRON_SECRET ?? "") } }), { cf: { cacheTtl: 0 } }).catch(()=>{}).then(r=>r?.json?.().catch(()=>{})).catch(()=>{})); try { const base = env.NEXT_PUBLIC_APP_URL ?? "https://invora"; const r = await fetch(base.replace(/\\/$/,"") + "/api/cron/cleanup", { headers: env.CRON_SECRET ? { authorization: "Bearer " + env.CRON_SECRET } : {} }); console.log("[cron] cleanup", await r.text().then(t=>t.slice(0,400)).catch(()=>"ok")); } catch(e){ console.log("[cron] err", String(e).slice(0,200)); } },\n  export default {`
  );
  if (!s.includes("scheduled")) {
    s = s.replace(/export default \{[\s\S]*?async fetch\(/, (m) => `  async scheduled(event, env, ctx) {\n    ctx.waitUntil((async () => {\n      try {\n        const base = (env.NEXT_PUBLIC_APP_URL ?? "https://invora").replace(/\\/$/, "");\n        const r = await fetch(base + "/api/cron/cleanup", { headers: env.CRON_SECRET ? { authorization: "Bearer " + env.CRON_SECRET } : {} });\n        console.log("[cron] cleanup", (await r.text()).slice(0,400));\n      } catch(e){ console.log("[cron] err", String(e).slice(0,200)); }\n    })());\n  },\n  ${m}`);
  }
  fs.writeFileSync(p, s);
  console.log("patched worker scheduled");
} else console.log("already patched");
