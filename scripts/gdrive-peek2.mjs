import { google } from "googleapis";
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
o.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
const d = google.drive({ version: "v3", auth: o });
for (const name of ["mstory-adat-jawa-ageng", "mstory-ivory-garden", "mstory-noir-eternel", "mstory-adat-jawa-prameswari", "mstory-heritage-silk"]) {
  const q = await d.files.list({ q: `name='${name}' and trashed=false`, fields: "files(id,name)", pageSize: 1 });
  const f = q.data.files?.[0];
  if (!f) { console.log(name, "NOTFOUND"); continue; }
  const r = await d.files.list({ q: `'${f.id}' in parents and trashed=false`, fields: "files(id,name)", pageSize: 4 });
  console.log(name, "->", f.id, (r.data.files||[]).map(x=>`${x.name} ${x.id.substring(0,8)}`).join(" | "));
}
