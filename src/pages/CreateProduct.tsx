import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "cereales" as "cereales" | "tubercules" | "legumes" | "fruits" | "legumineuses" | "epices",
    price: "",
    unit: "kg" as "kg" | "tonne" | "piece" | "litre",
    quantity_available: "",
    minimum_order: "1",
    is_organic: false,
    harvest_date: "",
    expiry_date: "",
    image_url: "",
  });

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        return;
      }

      setUserRole(profile.role);

      // Rediriger si l'utilisateur n'est pas un agriculteur
      if (profile.role !== "farmer") {
        toast({
          title: "Accès refusé",
          description: "Seuls les agriculteurs peuvent publier des produits.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkUserRole();
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || userRole !== "farmer") return;

    setLoading(true);
    try {
      // Récupérer l'ID du profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase.from("products").insert({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity_available: parseInt(formData.quantity_available),
        minimum_order: parseInt(formData.minimum_order),
        is_organic: formData.is_organic,
        harvest_date: formData.harvest_date || null,
        expiry_date: formData.expiry_date || null,
        image_url: formData.image_url || null,
        seller_id: profile.id,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Produit créé",
        description: "Votre produit a été publié avec succès !",
      });

      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "farmer") {
    return null; // L'utilisateur sera redirigé par useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au marché
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Publier un nouveau produit</CardTitle>
            <CardDescription>
              Ajoutez votre produit au marché pour le vendre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom du produit</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Tomates bio"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cereales">Céréales</SelectItem>
                      <SelectItem value="tubercules">Tubercules</SelectItem>
                      <SelectItem value="legumes">Légumes</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="legumineuses">Légumineuses</SelectItem>
                      <SelectItem value="epices">Épices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Unité</label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                      <SelectItem value="tonne">Tonne</SelectItem>
                      <SelectItem value="piece">Pièce</SelectItem>
                      <SelectItem value="litre">Litre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantité disponible</label>
                  <Input
                    type="number"
                    value={formData.quantity_available}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity_available: e.target.value })
                    }
                    placeholder="100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Commande minimum</label>
                  <Input
                    type="number"
                    value={formData.minimum_order}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_order: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date de récolte</label>
                  <Input
                    type="date"
                    value={formData.harvest_date}
                    onChange={(e) =>
                      setFormData({ ...formData, harvest_date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date d'expiration</label>
                  <Input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez votre produit, sa qualité, etc."
                  rows={4}
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="organic"
                  checked={formData.is_organic}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_organic: checked })
                  }
                />
                <label htmlFor="organic" className="text-sm font-medium">
                  Produit biologique
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Publication..." : "Publier le produit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
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

export default CreateProduct;