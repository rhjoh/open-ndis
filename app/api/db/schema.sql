create table if not exists carers (
  id bigserial primary key,
  given_name text not null,
  family_name text not null,
  full_name text generated always as (btrim(given_name || ' ' || family_name)) stored,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id bigserial primary key,
  given_name text not null,
  family_name text not null,
  full_name text generated always as (btrim(given_name || ' ' || family_name)) stored,
  email text,
  phone text, 
  create_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
    id bigserial primary key,
    username text not null,
    password_hash text not null, 
    password_salt text not null,
    email text not null, 
    role text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists shifts (
  id bigserial primary key,
  client_id bigint not null references clients(id) on delete restrict,
  carer_id bigint not null references carers(id) on delete restrict,
  shift_date date not null, 
  shift_start timestamptz not null, -- Might need changes here for overnight shifts. 
  shift_end timestamptz not null, -- Show shift time in users localtz or shift location tz ??? 
  shift_location_postcode int, 
  shift_status text not null default 'planned', -- Need to define shift types (enum?)
  shift_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), -- Need to update on row write 
  constraint chk_shift_time check (shift_end > shift_start),
);

insert into users (username, password_hash, password_salt, email, role) values ('admin', 'password123', 'seed-admin-salt','admin@easycare.com', 'admin'); 

insert into carers (given_name, family_name, email) values ('Sandy','Williams', 'sandy@easycare.com');
insert into carers (given_name, family_name, email) values ('David', 'Sinclair', 'david@easycare.com');
insert into carers (given_name, family_name, email) values ('Jemima', 'Patterson', 'jemima@easycare.com');

insert into clients (given_name, family_name, email, phone) values ('David', 'Sinclair', 'david@gmail.com', '0418382098');
insert into clients (given_name, family_name, email, phone) values ('Jessica', 'Dales', 'jess903@hotmail.com', '0428940283');
insert into clients (given_name, family_name, email, phone) values ('Simon', 'Smith', 'simon@gmail.com', '0483928041');


-- Example: Jemima caring for Jessica
insert into shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_status, shift_notes)
values (
  (select id from clients where given_name = 'Jessica' and family_name = 'Dales'),
  (select id from carers where given_name = 'Jemima' and family_name = 'Patterson'),
  date '2025-10-01',
  timestamp '2025-10-01 09:00:00+10',  -- 9am AEST
  timestamp '2025-10-01 13:00:00+10',  -- 1pm AEST
  3000,
  'planned',
  'Morning visit for routine care'
);

-- Example: Sandy caring for David (the client)
insert into shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_status, shift_notes)
values (
  (select id from clients where given_name = 'David' and family_name = 'Sinclair'),
  (select id from carers where given_name = 'Sandy' and family_name = 'Williams'),
  date '2025-10-02',
  timestamp '2025-10-02 14:00:00+10',
  timestamp '2025-10-02 18:00:00+10',
  2000,
  'confirmed',
  'Afternoon shift, community outing'
);

-- Example: David (carer) caring for Simon
insert into shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_status, shift_notes)
values (
  (select id from clients where given_name = 'Simon' and family_name = 'Smith'),
  (select id from carers where given_name = 'David' and family_name = 'Sinclair'),
  date '2025-10-03',
  timestamp '2025-10-03 20:00:00+10',
  timestamp '2025-10-04 02:00:00+10',  -- overnight shift
  4000,
  'planned',
  'Overnight care shift'
);

-- Another for Jemima caring for Simon
insert into shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_status, shift_notes)
values (
  (select id from clients where given_name = 'Simon' and family_name = 'Smith'),
  (select id from carers where given_name = 'Jemima' and family_name = 'Patterson'),
  date '2025-10-05',
  timestamp '2025-10-05 08:00:00+10',
  timestamp '2025-10-05 12:00:00+10',
  5000,
  'completed',
  'Morning shift completed successfully'
);
