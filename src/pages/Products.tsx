import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Leaf } from "lucide-react";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity_available: number;
  is_organic: boolean;
  image_url: string;
  seller_id: string;
  profiles: {
    full_name: string;
    location: string;
  };
}

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setUserRole(profile.role);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles:seller_id (
            full_name,
            location
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      cereales: "Céréales",
      tubercules: "Tubercules", 
      legumes: "Légumes",
      fruits: "Fruits",
      legumineuses: "Légumineuses",
      epices: "Épices"
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Marché des produits
            </h1>
            <p className="text-muted-foreground">
              Découvrez les produits frais de nos agriculteurs
            </p>
          </div>
          
          {userRole === "farmer" && (
            <Button onClick={() => navigate("/products/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Publier un produit
            </Button>
          )}
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="cereales">Céréales</SelectItem>
              <SelectItem value="tubercules">Tubercules</SelectItem>
              <SelectItem value="legumes">Légumes</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="legumineuses">Légumineuses</SelectItem>
              <SelectItem value="epices">Épices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des produits */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun produit trouvé selon vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {product.image_url && (
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.is_organic && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Leaf className="h-3 w-3 mr-1" />
                        Bio
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Par {product.profiles?.full_name}
                    {product.profiles?.location && ` • ${product.profiles.location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {getCategoryLabel(product.category)}
                      </Badge>
                      <span className="text-lg font-bold">
                        {product.price.toFixed(2)} FCFA/{product.unit}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="text-sm text-muted-foreground">
                      Disponible: {product.quantity_available} {product.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;