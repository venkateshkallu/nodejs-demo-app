-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read access for e-commerce)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Cart items are viewable by everyone"
  ON public.cart_items FOR SELECT
  USING (true);

CREATE POLICY "Cart items can be inserted by anyone"
  ON public.cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cart items can be updated by anyone"
  ON public.cart_items FOR UPDATE
  USING (true);

CREATE POLICY "Cart items can be deleted by anyone"
  ON public.cart_items FOR DELETE
  USING (true);

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Reviews can be inserted by anyone"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
  ('Electronics', 'Phones, laptops, and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
  ('Fashion', 'Clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050'),
  ('Home & Kitchen', 'Furniture and appliances', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a'),
  ('Books', 'Fiction and non-fiction', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d'),
  ('Sports', 'Sports equipment and gear', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211');

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count, stock, featured)
SELECT 
  'Wireless Headphones Pro',
  'Premium noise-cancelling wireless headphones with 30-hour battery life',
  299.99,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  id,
  4.5,
  128,
  50,
  true
FROM public.categories WHERE name = 'Electronics'
UNION ALL
SELECT 
  'Smart Watch Ultra',
  'Advanced fitness tracking with GPS and heart rate monitor',
  399.99,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  id,
  4.8,
  342,
  75,
  true
FROM public.categories WHERE name = 'Electronics'
UNION ALL
SELECT 
  'Designer Leather Jacket',
  'Premium quality genuine leather jacket with modern fit',
  249.99,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5',
  id,
  4.6,
  89,
  30,
  true
FROM public.categories WHERE name = 'Fashion'
UNION ALL
SELECT 
  'Running Shoes Elite',
  'Professional running shoes with advanced cushioning technology',
  159.99,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  id,
  4.7,
  215,
  100,
  true
FROM public.categories WHERE name = 'Sports'
UNION ALL
SELECT 
  '4K Ultra HD TV 55"',
  'Crystal clear 4K display with HDR and smart features',
  699.99,
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  id,
  4.4,
  67,
  25,
  false
FROM public.categories WHERE name = 'Electronics'
UNION ALL
SELECT 
  'Coffee Maker Deluxe',
  'Premium coffee maker with programmable settings',
  129.99,
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
  id,
  4.3,
  156,
  40,
  false
FROM public.categories WHERE name = 'Home & Kitchen'
UNION ALL
SELECT 
  'Best Seller Novel Collection',
  'Collection of top 10 bestselling novels of 2024',
  49.99,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
  id,
  4.9,
  423,
  200,
  false
FROM public.categories WHERE name = 'Books'
UNION ALL
SELECT 
  'Yoga Mat Premium',
  'Non-slip yoga mat with carrying strap',
  39.99,
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
  id,
  4.5,
  98,
  150,
  false
FROM public.categories WHERE name = 'Sports';