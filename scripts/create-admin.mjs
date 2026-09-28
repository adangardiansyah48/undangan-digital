import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const t=fs.readFileSync(".env.local","utf8");
for(const l of t.split("\n")){const m=l.match(/^\s*([^#=][^=]*?)\s*=\s*(.*)\s*$/);if(m)process.env[m[1].trim()]=m[2].trim();}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb=createClient(url,key,{auth:{persistSession:false}});
const email="admin@mstory.id", password="AdminMstory123!";
let userId;
const {data: listed}=await sb.auth.admin.listUsers();
const found=listed?.users?.find(u=>u.email===email);
if(found){ console.log("found existing",found.id); userId=found.id; await sb.auth.admin.updateUserById(found.id,{password}); console.log("password reset"); }
else {
  const {data,error}=await sb.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:"Admin mstory"}});
  if(error){ console.error(error.message); process.exit(1); }
  userId=data.user.id; console.log("created",userId);
}
const {error: upErr}=await sb.from("profiles").upsert({id:userId,email,role:"admin"},{onConflict:"id"});
if(upErr) console.error("profile upsert",upErr.message); else console.log("profile role admin set");
console.log(`ADMIN ${email} / ${password}`);
