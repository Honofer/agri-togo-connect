import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Download, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: string;
  author_name: string;
  category_name: string;
  views_count: number;
  pdf_url?: string;
  image_url?: string;
  created_at: string;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const { data, error } = await supabase
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
        .eq('id', articleId)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      if (data) {
        const formattedArticle: Article = {
          id: data.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          type: data.type,
          author_name: data.profiles?.full_name || 'Auteur anonyme',
          category_name: data.article_categories?.name || 'Non catégorisé',
          views_count: data.views_count || 0,
          pdf_url: data.pdf_url,
          image_url: data.image_url,
          created_at: data.created_at
        };

        setArticle(formattedArticle);
        
        // Incrémenter le nombre de vues
        await supabase.rpc('increment_article_views', { article_id: articleId });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'article.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux conseils
          </Button>

          {/* Article Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{article.category_name}</Badge>
                <Badge variant="outline">{article.type}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {article.title}
              </h1>
              
              <div className="flex items-center gap-6 text-muted-foreground text-sm mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.views_count + 1} vues</span>
                </div>
              </div>

              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full rounded-lg mb-6"
                />
              )}

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground mb-6 font-medium">
                  {article.excerpt}
                </p>
                <div 
                  className="text-foreground leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {article.content}
                </div>
              </div>

              {article.pdf_url && (
                <div className="mt-8 pt-6 border-t">
                  <Button
                    onClick={() => window.open(article.pdf_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le guide PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;