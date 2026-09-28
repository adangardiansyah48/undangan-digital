import fs from "fs";
import pg from "pg";
const t = fs.readFileSync(".env.local","utf8");
for(const l of t.split("\n")){const m=l.match(/^\s*([^#=][^=]*?)\s*=\s*(.*)\s*$/);if(m)process.env[m[1].trim()]=m[2].trim();}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const ref=url.match(/https:\/\/([^\.]+)\./)[1];
const pool=new pg.Pool({host:"aws-0-ap-southeast-1.pooler.supabase.com",port:6543,database:"postgres",user:"postgres."+ref,password:process.env.PASSWORD_DB,ssl:{rejectUnauthorized:false}});
const sql=fs.readFileSync("supabase/migration_guest_orders.sql","utf8");
try{ await pool.query(sql); console.log("migration ok"); }catch(e){ console.error(e.message); console.error(e); process.exit(1);} await pool.end();
