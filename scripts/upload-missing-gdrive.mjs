import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import { Readable } from "stream";

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const oauth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
oauth.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth });
const ROOT = process.env.GOOGLE_DRIVE_FOLDER_ID;

const MISSING = ["opaline","velours-nuit","atelier-blush","maison-lace","jardin-noir","aureline","brume","chantelle","seraphine","divine-ivory"];

async function ensureFolder(name, parentId) {
  const q = [`name = '${name.replace(/'/g,"\\'")}'`, "mimeType = 'application/vnd.google-apps.folder'", "trashed=false", parentId?`'${parentId}' in parents`:undefined].filter(Boolean).join(" and ");
  const f=await drive.files.list({q, fields:"files(id)", pageSize:1});
  if(f.data.files?.[0]?.id) return f.data.files[0].id;
  const c=await drive.files.create({requestBody:{name, mimeType:"application/vnd.google-apps.folder", parents:parentId?[parentId]:undefined}, fields:"id"});
  return c.data.id;
}
async function uploadImageUrl(url, filename, folderId){
  const r=await fetch(url); if(!r.ok) throw new Error(url+" "+r.status);
  const buf=Buffer.from(await r.arrayBuffer());
  const cr=await drive.files.create({requestBody:{name:filename, parents:[folderId]}, media:{mimeType:r.headers.get("content-type")||"image/jpeg", body:Readable.from(buf)}, fields:"id"});
  await drive.permissions.create({fileId:cr.data.id, requestBody:{role:"reader",type:"anyone"}}).catch(()=>{});
  return `https://drive.google.com/uc?export=view&id=${cr.data.id}`;
}

const SEEDS=["https://picsum.photos/seed/wedding5/800/600","https://picsum.photos/seed/wedding6/800/600","https://picsum.photos/seed/wedding7/800/600","https://picsum.photos/seed/wedding8/800/600"];

for(const slug of MISSING){
  const {data:inv}=await supa.from("invitations").select("id").eq("slug",slug).maybeSingle();
  if(!inv){ console.log(slug,"no invitation"); continue; }
  const folderId=await ensureFolder(`mstory-${slug}`, ROOT);
  console.log(slug, "folder", folderId);
  for(let i=0;i<4;i++){
    const url=await uploadImageUrl(SEEDS[i%SEEDS.length]+`?t=${Date.now()}-${i}`, `${slug}-${i+1}.jpg`, folderId);
    const {data:has}=await supa.from("gallery_items").select("id").eq("invitation_id",inv.id).eq("url",url).maybeSingle();
    if(!has) await supa.from("gallery_items").insert({invitation_id:inv.id, type:"photo", url, r2_key:null, drive_file_id:url.match(/id=([^&]+)/)?.[1], sort_order:i});
    console.log(" ", i+1, "ok");
  }
}
console.log("done 10 missing");
