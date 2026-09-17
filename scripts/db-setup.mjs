// Creates the studio's two tables. Safe to re-run.
import { neon } from "@neondatabase/serverless";
import { loadEnv } from "./env.mjs";

await loadEnv();

// Migrations want a direct connection, not the pooled one.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set — run `vercel env pull .env.local`");
const sql = neon(url);

await sql`create extension if not exists pgcrypto`;

await sql`
  create table if not exists gallery_items (
    id           uuid primary key default gen_random_uuid(),
    title        text not null,
    category     text not null default 'garments',
    medium       text not null default '',
    year         text not null default '',
    description  text not null default '',
    diary        text not null default '',
    url          text not null,
    storage_path text not null,
    is_deleted   boolean not null default false,
    created_at   timestamptz not null default now()
  )`;

// The archive filters by category; every other read is the whole table.
await sql`create index if not exists gallery_items_category_idx on gallery_items (category) where is_deleted = false`;

await sql`
  create table if not exists settings (
    key   text primary key,
    value jsonb not null
  )`;

const [{ count }] = await sql`select count(*)::int as count from gallery_items`;
console.log(`db-setup: tables ready — gallery_items holds ${count} row(s)`);
