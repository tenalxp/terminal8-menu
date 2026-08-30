-- Terminal 8 Menu - Supabase Setup
-- Run this SQL in the Supabase SQL Editor of a NEW, standalone Supabase
-- project for this app (kept separate from the terminal8-stock project
-- on purpose, per project decision).

create table if not exists menu_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text not null default 'Other',
  image_url text,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_menu_items_category on menu_items(category);

-- Enable Row Level Security - anyone can read the menu (it's a public,
-- customer-facing page reached by scanning a QR code), but nobody can
-- write to it through the app. The owner manages rows via the Supabase
-- Dashboard, which uses the privileged service role and bypasses RLS.
alter table menu_items enable row level security;

drop policy if exists "public read menu_items" on menu_items;
create policy "public read menu_items" on menu_items
  for select to anon
  using (true);

-- Storage bucket for item photos (public read so <img> tags can load them
-- directly). Upload photos here via Dashboard -> Storage -> menu-photos,
-- then paste the resulting public URL into a row's image_url column.
insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do nothing;

drop policy if exists "menu_photos_public_read" on storage.objects;
create policy "menu_photos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'menu-photos');

-- Sample rows for local testing - safe to delete once you add real items.
-- insert into menu_items (name, description, price, category, sort_order) values
--   ('Pad Thai', 'Rice noodles, shrimp, egg, tamarind sauce, crushed peanuts', 89.00, 'Noodles', 1),
--   ('Green Curry', 'Chicken, Thai eggplant, sweet basil, coconut milk', 95.00, 'Curries', 1),
--   ('Thai Iced Tea', 'Black tea, condensed milk, evaporated milk', 45.00, 'Drinks', 1),
--   ('Mango Sticky Rice', 'Sweet sticky rice, fresh mango, coconut cream', 79.00, 'Desserts', 1);
