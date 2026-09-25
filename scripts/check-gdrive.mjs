import { google } from "googleapis";
const oauth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
oauth.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth });
const root = process.env.GOOGLE_DRIVE_FOLDER_ID;
let pageToken; const all=[];
do {
  const r = await drive.files.list({ q: `'${root}' in parents and trashed=false`, fields: "nextPageToken,files(id,name)", pageSize: 200, pageToken });
  all.push(...(r.data.files||[])); pageToken=r.data.nextPageToken;
} while(pageToken);
console.log("folders", all.length);
console.log(all.map(f=>f.name).sort().join("\n"));
let total=0;
for(const f of all){ const lr=await drive.files.list({ q: `'${f.id}' in parents and trashed=false`, fields:"files(id)", pageSize:200 }); total+=(lr.data.files||[]).length; }
console.log("total files", total);
