import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Droplets, Sun, Sprout, Users, TrendingUp, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  author_name: string;
  category_name: string;
  views_count: number;
  pdf_url?: string;
  image_url?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const AdviceSection = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: any } = {
      'Culture des Céréales': Sprout,
      'Maraîchage': Droplets,
      'Élevage': Users,
      'Gestion des Sols': Sun,
      'Protection des Cultures': TrendingUp,
      'Techniques Modernes': BookOpen
    };
    return icons[categoryName] || BookOpen;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('article_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Récupérer les articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          profiles!author_id (
            full_name
          ),
          article_categories (
            name
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (articlesError) throw articlesError;

      const formattedArticles = articlesData?.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content,
        type: article.type,
        author_name: article.profiles?.full_name || 'Auteur anonyme',
        category_name: article.article_categories?.name || 'Non catégorisé',
        views_count: article.views_count || 0,
        pdf_url: article.pdf_url,
        image_url: article.image_url,
        created_at: article.created_at
      })) || [];

      setCategories(categoriesData || []);
      setArticles(formattedArticles);
      if (formattedArticles.length > 0) {
        setFeaturedArticle(formattedArticles[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conseils. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleView = async (articleId: string) => {
    try {
      await supabase.rpc('increment_article_views', { article_id: articleId });
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  };

  return (
    <section id="conseils" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Conseils Agricoles
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez aux meilleures pratiques agricoles adaptées au climat et aux sols togolais. 
            Nos experts partagent leurs connaissances pour améliorer vos rendements.
          </p>
        </div>

        {/* Advice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adviceCards.map((advice, index) => (
            <Card key={index} className="bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <advice.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">{advice.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  {advice.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Points clés :</h4>
                  <ul className="space-y-1">
                    {advice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    toast({
                      title: `Guide: ${advice.title}`,
                      description: `Découvrez nos conseils détaillés sur ${advice.title.toLowerCase()}. Guide complet bientôt disponible !`,
                    });
                  }}
                >
                  En Savoir Plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Article */}
        <div className="bg-gradient-card rounded-lg p-8 shadow-soft">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Article du Mois : Culture du Maïs en Saison Sèche
              </h3>
              <p className="text-muted-foreground mb-6">
                Découvrez les techniques innovantes pour cultiver le maïs même pendant 
                la saison sèche au Togo. Des méthodes éprouvées par nos agriculteurs partenaires.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="success"
                  onClick={() => {
                    toast({
                      title: "Article du Mois",
                      description: "Téléchargement de l'article sur la culture du maïs en saison sèche... Fonctionnalité bientôt disponible !",
                    });
                  }}
                >
                  Lire l'Article
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Guide PDF",
                      description: "Téléchargement du guide PDF en cours... Fonctionnalité bientôt disponible !",
                    });
                  }}
                >
                  Télécharger PDF
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">📚</div>
              <p className="text-sm text-muted-foreground">
                Guide complet avec illustrations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdviceSection;