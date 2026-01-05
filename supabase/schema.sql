-- ====================================
-- TALENTR DATABASE SCHEMA v1.0
-- Run this in Supabase SQL Editor
-- ====================================

-- 1. VENDORS TABLE
-- Stores all service providers (photographers, DJs, etc.)
create table if not exists vendors (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Basic Info
    user_id uuid references auth.users on delete set null, -- Link to auth user
    name text not null,
    category text not null check (category in (
        'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer', 
        'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show', 
        'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef'
    )),
    city text not null check (city in (
        'Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'
    )),
    
    -- Profile Data
    description text,
    image_url text,
    phone text, -- WhatsApp format: 972XXXXXXXXX
    email text,
    website text,
    
    -- Pricing
    price_from integer not null default 0,
    price_currency text default 'ILS',
    
    -- Rating & Reviews (cached for performance)
    rating numeric(2,1) default 0.0,
    reviews_count integer default 0,
    
    -- Tags (array of strings)
    tags text[] default '{}',
    
    -- Status
    is_verified boolean default false,
    is_active boolean default true,
    is_featured boolean default false
);

-- 2. BOOKINGS TABLE (already referenced in BookingModal)
create table if not exists bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    client_id uuid references auth.users on delete set null,
    vendor_id uuid references vendors on delete cascade not null,
    
    event_date date not null,
    event_type text not null,
    details text,
    
    status text default 'pending' check (status in ('pending', 'confirmed', 'declined', 'completed', 'cancelled')),
    price_quoted integer,
    
    -- Contact status
    whatsapp_clicked boolean default false,
    deposit_paid boolean default false
);

-- 3. REVIEWS TABLE
create table if not exists reviews (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    vendor_id uuid references vendors on delete cascade not null,
    client_id uuid references auth.users on delete set null,
    booking_id uuid references bookings on delete set null,
    
    rating integer not null check (rating >= 1 and rating <= 5),
    text text,
    
    -- Moderation
    is_approved boolean default true
);

-- 4. PORTFOLIO IMAGES TABLE
create table if not exists portfolio_images (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    vendor_id uuid references vendors on delete cascade not null,
    image_url text not null,
    caption text,
    sort_order integer default 0
);

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on all tables
alter table vendors enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table portfolio_images enable row level security;

-- VENDORS: Public read, vendor owners can update their own
create policy "Vendors are publicly readable"
    on vendors for select
    using (is_active = true);

create policy "Vendors can update their own profile"
    on vendors for update
    using (auth.uid() = user_id);

create policy "Authenticated users can create vendor profiles"
    on vendors for insert
    with check (auth.uid() = user_id);

-- BOOKINGS: Clients see their own, vendors see bookings for them
create policy "Users can view their own bookings"
    on bookings for select
    using (auth.uid() = client_id);

create policy "Vendors can view bookings for them"
    on bookings for select
    using (
        auth.uid() in (
            select user_id from vendors where id = bookings.vendor_id
        )
    );

create policy "Authenticated users can create bookings"
    on bookings for insert
    with check (auth.uid() = client_id);

create policy "Vendors can update booking status"
    on bookings for update
    using (
        auth.uid() in (
            select user_id from vendors where id = bookings.vendor_id
        )
    );

-- REVIEWS: Public read, clients can create for their bookings
create policy "Reviews are publicly readable"
    on reviews for select
    using (is_approved = true);

create policy "Clients can create reviews for their bookings"
    on reviews for insert
    with check (auth.uid() = client_id);

-- PORTFOLIO: Public read, vendors can manage their own
create policy "Portfolio images are publicly readable"
    on portfolio_images for select
    using (true);

create policy "Vendors can manage their portfolio"
    on portfolio_images for all
    using (
        auth.uid() in (
            select user_id from vendors where id = portfolio_images.vendor_id
        )
    );

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

create index if not exists idx_vendors_category on vendors(category);
create index if not exists idx_vendors_city on vendors(city);
create index if not exists idx_vendors_rating on vendors(rating desc);
create index if not exists idx_vendors_is_featured on vendors(is_featured) where is_featured = true;
create index if not exists idx_bookings_vendor on bookings(vendor_id);
create index if not exists idx_bookings_client on bookings(client_id);
create index if not exists idx_reviews_vendor on reviews(vendor_id);

-- ====================================
-- FUNCTIONS
-- ====================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_vendors_updated_at
    before update on vendors
    for each row execute function update_updated_at_column();

create trigger update_bookings_updated_at
    before update on bookings
    for each row execute function update_updated_at_column();

-- Auto-recalculate vendor rating when review added
create or replace function update_vendor_rating()
returns trigger as $$
begin
    update vendors set
        rating = (select round(avg(rating)::numeric, 1) from reviews where vendor_id = new.vendor_id and is_approved = true),
        reviews_count = (select count(*) from reviews where vendor_id = new.vendor_id and is_approved = true)
    where id = new.vendor_id;
    return new;
end;
$$ language plpgsql;

create trigger update_rating_on_review
    after insert or update or delete on reviews
    for each row execute function update_vendor_rating();
