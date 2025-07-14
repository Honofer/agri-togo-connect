-- Création des types ENUM
CREATE TYPE public.user_role AS ENUM ('farmer', 'buyer', 'expert', 'admin');
CREATE TYPE public.product_category AS ENUM ('cereales', 'tubercules', 'legumes', 'fruits', 'legumineuses', 'epices');
CREATE TYPE public.product_unit AS ENUM ('kg', 'tonne', 'piece', 'litre');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE public.article_type AS ENUM ('guide', 'conseil', 'actualite');
CREATE TYPE public.weather_alert_type AS ENUM ('storm', 'drought', 'flood', 'frost');
CREATE TYPE public.credit_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed');
CREATE TYPE public.document_type AS ENUM ('identity', 'land_ownership', 'bank_statement', 'business_plan', 'other');

-- Table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'buyer',
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des produits agricoles
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit product_unit NOT NULL DEFAULT 'kg',
  quantity_available INTEGER NOT NULL DEFAULT 0,
  minimum_order INTEGER DEFAULT 1,
  image_url TEXT,
  is_organic BOOLEAN DEFAULT FALSE,
  harvest_date DATE,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des commandes
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des avis et notations
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des messages/conversations
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des catégories d'articles
CREATE TABLE public.article_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des articles/guides
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.article_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  type article_type NOT NULL DEFAULT 'conseil',
  image_url TEXT,
  pdf_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des données météorologiques
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  temperature DECIMAL(5, 2),
  humidity INTEGER,
  precipitation DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  conditions TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des alertes météo
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  type weather_alert_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des institutions financières
CREATE TABLE public.financial_institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'bank', 'microfinance', 'government'
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des demandes de crédit
CREATE TABLE public.credit_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.financial_institutions(id) ON DELETE SET NULL,
  amount_requested DECIMAL(12, 2) NOT NULL,
  purpose TEXT NOT NULL,
  status credit_status NOT NULL DEFAULT 'draft',
  application_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_date TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  disbursement_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des documents
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.credit_applications(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'order', 'weather', 'credit', 'message'
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activation de RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les profils
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour les produits
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can create their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = seller_id));
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = seller_id));
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = seller_id));

-- Politiques RLS pour les commandes
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = buyer_id) OR 
  auth.uid() = (SELECT user_id FROM profiles WHERE id = seller_id)
);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = buyer_id));
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = buyer_id) OR 
  auth.uid() = (SELECT user_id FROM profiles WHERE id = seller_id)
);

-- Politiques RLS pour les avis
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = reviewer_id));
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = reviewer_id));

-- Politiques RLS pour les messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = sender_id) OR 
  auth.uid() = (SELECT user_id FROM profiles WHERE id = receiver_id)
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = sender_id));

-- Politiques RLS pour les catégories d'articles
CREATE POLICY "Article categories are viewable by everyone" ON public.article_categories FOR SELECT USING (true);
CREATE POLICY "Only experts and admins can manage categories" ON public.article_categories FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('expert', 'admin'))
);

-- Politiques RLS pour les articles
CREATE POLICY "Published articles are viewable by everyone" ON public.articles FOR SELECT USING (is_published = true OR auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));
CREATE POLICY "Experts and admins can create articles" ON public.articles FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id) AND
  (SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('expert', 'admin')
);
CREATE POLICY "Authors can update their own articles" ON public.articles FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Politiques RLS pour les données météo
CREATE POLICY "Weather data is viewable by everyone" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Only admins can manage weather data" ON public.weather_data FOR ALL USING (
  (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
);

-- Politiques RLS pour les alertes météo
CREATE POLICY "Active weather alerts are viewable by everyone" ON public.weather_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage weather alerts" ON public.weather_alerts FOR ALL USING (
  (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
);

-- Politiques RLS pour les institutions financières
CREATE POLICY "Financial institutions are viewable by everyone" ON public.financial_institutions FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage institutions" ON public.financial_institutions FOR ALL USING (
  (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
);

-- Politiques RLS pour les demandes de crédit
CREATE POLICY "Users can view their own credit applications" ON public.credit_applications FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = applicant_id));
CREATE POLICY "Users can create credit applications" ON public.credit_applications FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = applicant_id));
CREATE POLICY "Users can update their own applications" ON public.credit_applications FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = applicant_id));

-- Politiques RLS pour les documents
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));
CREATE POLICY "Users can upload their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Politiques RLS pour les notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_credit_applications_updated_at BEFORE UPDATE ON public.credit_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertion de données de base
INSERT INTO public.article_categories (name, description) VALUES
  ('Culture des Céréales', 'Conseils pour la culture du maïs, riz, mil, sorgho'),
  ('Maraîchage', 'Techniques de culture des légumes'),
  ('Élevage', 'Conseils pour l''élevage de volailles, bovins, caprins'),
  ('Gestion des Sols', 'Techniques d''amélioration et de conservation des sols'),
  ('Protection des Cultures', 'Lutte contre les ravageurs et maladies'),
  ('Techniques Modernes', 'Agriculture de précision et nouvelles technologies');

INSERT INTO public.financial_institutions (name, type, contact_email, contact_phone, description, is_active) VALUES
  ('Banque Agricole du Togo', 'bank', 'info@bat.tg', '+228 22 21 45 67', 'Banque spécialisée dans le financement agricole', true),
  ('FUCEC-Togo', 'microfinance', 'contact@fucec.tg', '+228 22 61 18 29', 'Institution de microfinance pour les agriculteurs', true),
  ('Caisse Nationale de Crédit Agricole', 'government', 'cnca@gouv.tg', '+228 22 21 32 45', 'Institution publique de crédit agricole', true);