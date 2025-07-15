import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const CreateArticle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    type: "conseil" as "guide" | "conseil" | "actualite",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Récupérer l'ID du profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase.from("articles").insert({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        type: formData.type,
        image_url: formData.image_url || null,
        author_id: profile.id,
        is_published: true,
      });

      if (error) throw error;

      toast({
        title: "Article créé",
        description: "Votre article a été publié avec succès !",
      });

      navigate("/articles");
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/articles")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux articles
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Créer un nouvel article</CardTitle>
            <CardDescription>
              Partagez vos connaissances et conseils avec la communauté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Titre de votre article"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type d'article</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "guide" | "conseil" | "actualite") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conseil">Conseil</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="actualite">Actualité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Résumé</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Bref résumé de votre article"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL de l'image (optionnel)</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contenu</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Rédigez le contenu de votre article ici..."
                  rows={12}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Publication..." : "Publier l'article"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/articles")}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateArticle;