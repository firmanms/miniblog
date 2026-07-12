-- Create Categories Table
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Posts Table
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
-- 1. Public can view all categories
CREATE POLICY "Public can view categories"
ON public.categories FOR SELECT
TO public
USING (true);

-- 2. Authenticated users (Admin) can insert/update/delete categories
CREATE POLICY "Admin can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- Policies for Posts
-- 1. Public can only view published posts
CREATE POLICY "Public can view published posts"
ON public.posts FOR SELECT
TO public
USING (is_published = true);

-- 2. Authenticated users (Admin) can view all posts (including drafts)
CREATE POLICY "Admin can view all posts"
ON public.posts FOR SELECT
TO authenticated
USING (true);

-- 3. Authenticated users (Admin) can insert/update/delete posts
CREATE POLICY "Admin can manage posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin can update posts"
ON public.posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can delete posts"
ON public.posts FOR DELETE
TO authenticated
USING (true);

-- Trigger to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
