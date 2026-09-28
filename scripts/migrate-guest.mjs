import pg from "pg";
import fs from "fs";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const m = url?.match(/https:\/\/([^.]+)\./);
const ref = m?.[1];
const pwd = process.env.PASSWORD_DB;
if (!ref || !pwd) { console.error("missing ref/pwd", { ref: !!ref, pwd: !!pwd }); process.exit(1); }
const pool = new pg.Pool({ host: `db.${ref}.supabase.co`, port: 5432, database: "postgres", user: "postgres", password: pwd, ssl: { rejectUnauthorized: false } });
const sql = fs.readFileSync("supabase/migration_guest_orders.sql", "utf8");
try {
  await pool.query(sql);
  console.log("migration ok");
} catch (e) { console.error(e.message); console.error(e); process.exit(1); }
await pool.end();
