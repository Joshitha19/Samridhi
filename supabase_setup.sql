-- SAMRIDHI: SUPABASE DATABASE SETUP SCRIPT
-- Run this script in your Supabase SQL Editor (Dashboards -> SQL Editor -> New Query)

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    type TEXT DEFAULT 'Freelancer',
    upi_vpa TEXT,
    upi_verified BOOLEAN DEFAULT false,
    aadhaar_verified BOOLEAN DEFAULT false,
    pan_verified BOOLEAN DEFAULT false
);

-- 2. Create Loans Table
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lender TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    rate TEXT NOT NULL,
    emi TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    date DATE DEFAULT CURRENT_DATE
);

-- 3. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    merchant TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT,
    type TEXT NOT NULL
);

-- 4. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT,
    verified BOOLEAN DEFAULT false
);

-- 5. Create Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    price NUMERIC DEFAULT 0,
    last_updated DATE DEFAULT CURRENT_DATE
);

-- =========================================================
-- CHOOSE ONE OF THE OPTIONS BELOW AND EXECUTE:
-- =========================================================

-- OPTION A: DISABLE ROW LEVEL SECURITY (RLS) - Recommended for testing/sandbox development
-- This allows anyone to read/write to the tables without authentication issues.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory DISABLE ROW LEVEL SECURITY;

/*
-- OPTION B: ENABLE RLS WITH COOPERATIVE POLICIES (For production security)
-- Uncomment this section if you prefer to keep RLS active.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read of profiles for Bankers" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to manage own profile" ON public.profiles
    FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Loans Policies
CREATE POLICY "Allow public read/update of loans for Bankers" ON public.loans
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Transactions Policies
CREATE POLICY "Allow users to manage own transactions" ON public.transactions
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow bankers to read transactions for underwriting" ON public.transactions
    FOR SELECT TO authenticated USING (true);

-- Skills Policies
CREATE POLICY "Allow users to manage own skills" ON public.skills
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow bankers to read skills for underwriting" ON public.skills
    FOR SELECT TO authenticated USING (true);

-- Inventory Policies
CREATE POLICY "Allow users to manage own inventory" ON public.inventory
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow bankers to read inventory for underwriting" ON public.inventory
    FOR SELECT TO authenticated USING (true);
*/
