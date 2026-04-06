-- 1. Create a table for public profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    location TEXT,
    region TEXT,
    avatar_url TEXT,
    rating NUMERIC DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_swaps INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can insert their own profile." 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger for new user to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create products table
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    wants_in_return TEXT,
    acceptable_items TEXT[],
    image_url TEXT,
    region TEXT,
    location TEXT,
    boosted BOOLEAN DEFAULT false,
    premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- 3. Create proposals table
CREATE TABLE public.proposals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    offered_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    requested_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Proposals are viewable by participants" ON public.proposals FOR SELECT USING (auth.uid() IN (from_user_id, to_user_id));
CREATE POLICY "Users can insert proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Participants can update proposals" ON public.proposals FOR UPDATE USING (auth.uid() IN (from_user_id, to_user_id));

-- 4. Create chats table
CREATE TABLE public.chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participants UUID[] NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    unread_by UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chats are viewable by participants" ON public.chats FOR SELECT USING (auth.uid() = ANY(participants));
CREATE POLICY "Participants can insert chats" ON public.chats FOR INSERT WITH CHECK (auth.uid() = ANY(participants));
CREATE POLICY "Participants can update chats" ON public.chats FOR UPDATE USING (auth.uid() = ANY(participants));

-- 5. Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are viewable by chat participants" ON public.messages 
  FOR SELECT USING (
    auth.uid() IN (
      SELECT unnest(participants) FROM public.chats WHERE id = chat_id
    )
  );
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Storage bucket for products
-- Go to Storage -> Buckets -> click New Bucket -> name it "products", mark as public.
-- Example policy for storage (run in SQL editor if you have full permissions, otherwise do it in the UI)
-- insert policy: allow authenticated to insert to products
-- select policy: allow public to select from products
