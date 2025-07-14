-- Insertion de données de test pour les produits agricoles
-- D'abord, nous devons créer des profils utilisateurs de test
INSERT INTO public.profiles (user_id, email, full_name, phone, role, location, latitude, longitude, is_verified) VALUES
(gen_random_uuid(), 'koffi.mensah@test.com', 'Koffi Mensah', '+228 90 12 34 56', 'farmer', 'Lomé, Maritime', 6.1319, 1.2228, true),
(gen_random_uuid(), 'ama.adjoa@test.com', 'Ama Adjoa', '+228 91 23 45 67', 'farmer', 'Kara, Kara', 9.5515, 1.1865, true),
(gen_random_uuid(), 'kwame.asante@test.com', 'Kwame Asante', '+228 92 34 56 78', 'farmer', 'Sokodé, Centrale', 8.9803, 1.1424, true),
(gen_random_uuid(), 'akosua.tano@test.com', 'Akosua Tano', '+228 93 45 67 89', 'farmer', 'Atakpamé, Plateaux', 7.5335, 1.1283, true),
(gen_random_uuid(), 'dr.agro@test.com', 'Dr. Jean-Paul Kouassi', '+228 94 56 78 90', 'expert', 'Lomé, Maritime', 6.1319, 1.2228, true);

-- Ensuite, insérer les produits en utilisant les IDs des profils créés
INSERT INTO public.products (seller_id, name, description, category, price, unit, quantity_available, minimum_order, is_organic, harvest_date, is_active)
SELECT 
  p.id,
  products_data.name,
  products_data.description,
  products_data.category::product_category,
  products_data.price,
  products_data.unit::product_unit,
  products_data.quantity_available,
  products_data.minimum_order,
  products_data.is_organic,
  products_data.harvest_date,
  true
FROM public.profiles p
CROSS JOIN (
  VALUES 
    ('Maïs Bio', 'Maïs cultivé sans pesticides, récolte récente', 'cereales', 800.00, 'kg', 50, 5, true, '2024-01-15'),
    ('Manioc Frais', 'Manioc fraîchement récolté, idéal pour la transformation', 'tubercules', 600.00, 'kg', 100, 10, false, '2024-01-20'),
    ('Igname de Qualité', 'Igname premium, variété locale', 'tubercules', 1200.00, 'kg', 30, 2, false, '2024-01-10'),
    ('Tomates Rouges', 'Tomates fraîches du jour', 'legumes', 500.00, 'kg', 25, 1, false, '2024-01-25'),
    ('Haricots Blancs', 'Haricots secs de qualité', 'legumineuses', 900.00, 'kg', 40, 5, true, '2023-12-20'),
    ('Plantains Mûrs', 'Plantains prêts à consommer', 'fruits', 400.00, 'kg', 60, 3, false, '2024-01-22')
) AS products_data(name, description, category, price, unit, quantity_available, minimum_order, is_organic, harvest_date)
WHERE p.role = 'farmer'
LIMIT 6;

-- Insérer des articles de conseil
INSERT INTO public.articles (author_id, category_id, title, content, excerpt, type, is_published, views_count)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'expert' LIMIT 1),
  ac.id,
  articles_data.title,
  articles_data.content,
  articles_data.excerpt,
  articles_data.type::article_type,
  true,
  articles_data.views_count
FROM public.article_categories ac
CROSS JOIN (
  VALUES 
    ('Culture du Maïs en Saison Sèche', 'Dans cet article, nous explorons les techniques innovantes pour cultiver le maïs même pendant la saison sèche au Togo...', 'Techniques pour cultiver le maïs en saison sèche', 'guide', 245),
    ('Gestion Optimale de l''Eau d''Irrigation', 'L''eau est une ressource précieuse en agriculture. Découvrez comment optimiser son utilisation...', 'Conseils pour une irrigation efficace', 'conseil', 189),
    ('Protection Naturelle contre les Ravageurs', 'Méthodes biologiques pour protéger vos cultures sans pesticides chimiques...', 'Solutions écologiques contre les nuisibles', 'guide', 156)
) AS articles_data(title, content, excerpt, type, views_count)
WHERE ac.name IN ('Culture des Céréales', 'Gestion des Sols', 'Protection des Cultures')
LIMIT 3;

-- Insérer des données météo de test
INSERT INTO public.weather_data (location, temperature, humidity, precipitation, wind_speed, conditions, date) VALUES
('Lomé', 28.5, 75, 0, 15, 'Ensoleillé', CURRENT_DATE),
('Kara', 25.2, 68, 0, 12, 'Nuageux', CURRENT_DATE),
('Sokodé', 23.8, 82, 5.2, 8, 'Pluie légère', CURRENT_DATE),
('Atakpamé', 26.1, 70, 0, 10, 'Partiellement nuageux', CURRENT_DATE),
('Dapaong', 29.3, 65, 0, 18, 'Ensoleillé', CURRENT_DATE);

-- Insérer une alerte météo de test
INSERT INTO public.weather_alerts (location, type, title, description, severity, start_date, end_date, is_active) VALUES
('Région Maritime', 'storm', 'Risque d''Orage', 'Orages possibles cet après-midi avec vents forts. Protégez vos cultures sensibles.', 3, NOW(), NOW() + INTERVAL '1 day', true);

-- Insérer des avis pour les produits
INSERT INTO public.reviews (reviewer_id, reviewed_id, product_id, rating, comment)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'farmer' ORDER BY random() LIMIT 1),
  p.seller_id,
  p.id,
  (4 + random())::int,
  'Excellent produit, très satisfait de la qualité !'
FROM public.products p
LIMIT 10;