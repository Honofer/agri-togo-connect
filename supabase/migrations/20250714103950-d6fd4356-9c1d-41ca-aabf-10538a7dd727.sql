-- Fonction pour incrémenter le nombre de vues d'un article
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.articles 
  SET views_count = COALESCE(views_count, 0) + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;