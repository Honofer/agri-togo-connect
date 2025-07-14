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

        {/* Categories Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card shadow-soft">
                <CardHeader className="text-center pb-4">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              const categoryArticles = articles.filter(article => article.category_name === category.name);
              
              return (
                <Card key={category.id} className="bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-3">{category.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-center">
                      {category.description}
                    </p>
                    
                    {categoryArticles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">Articles récents :</h4>
                        <ul className="space-y-1">
                          {categoryArticles.slice(0, 3).map((article) => (
                            <li key={article.id} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="truncate">{article.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => {
                        window.location.href = '/articles';
                      }}
                    >
                      Voir les Articles ({categoryArticles.length})
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && (
          <div className="bg-gradient-card rounded-lg p-8 shadow-soft">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Article du Mois : {featuredArticle.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                  <span>Par {featuredArticle.author_name}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {featuredArticle.views_count} vues
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Button 
                    variant="success"
                    onClick={() => {
                      handleArticleView(featuredArticle.id);
                      window.location.href = `/articles/${featuredArticle.id}`;
                    }}
                  >
                    Lire l'Article
                  </Button>
                  {featuredArticle.pdf_url && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        window.open(featuredArticle.pdf_url, '_blank');
                        toast({
                          title: "Téléchargement PDF",
                          description: "Ouverture du guide PDF...",
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center">
                {featuredArticle.image_url ? (
                  <img 
                    src={featuredArticle.image_url} 
                    alt={featuredArticle.title}
                    className="w-full max-w-sm mx-auto rounded-lg shadow-soft"
                  />
                ) : (
                  <>
                    <div className="text-8xl mb-4">📚</div>
                    <p className="text-sm text-muted-foreground">
                      Guide complet avec illustrations
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdviceSection;