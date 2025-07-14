import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  seller_name: string;
  seller_location: string;
  price: number;
  unit: string;
  quantity_available: number;
  category: string;
  rating?: number;
  image_url?: string;
}

const MarketSection = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'cereales': '🌽',
      'tubercules': '🍠',
      'legumes': '🍅',
      'fruits': '🍌',
      'legumineuses': '🫘',
      'epices': '🌶️'
    };
    return emojis[category] || '🌱';
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'cereales': 'Céréales',
      'tubercules': 'Tubercules',
      'legumes': 'Légumes',
      'fruits': 'Fruits',
      'legumineuses': 'Légumineuses',
      'epices': 'Épices'
    };
    return names[category] || category;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!seller_id (
            full_name,
            location,
            phone
          ),
          reviews (
            rating
          )
        `)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;

      const productsWithRating = data?.map(product => {
        const avgRating = product.reviews.length > 0 
          ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
          : 0;

        return {
          id: product.id,
          name: product.name,
          seller_name: product.profiles?.full_name || 'Vendeur anonyme',
          seller_location: product.profiles?.location || 'Localisation non spécifiée',
          price: product.price,
          unit: product.unit,
          quantity_available: product.quantity_available,
          category: product.category,
          rating: Math.round(avgRating * 10) / 10,
          image_url: product.image_url
        };
      }) || [];

      setProducts(productsWithRating);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="marche" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Marché Local
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les meilleurs produits agricoles du Togo directement des producteurs. 
            Des prix justes, une qualité garantie et un impact direct sur l'économie locale.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gradient-card shadow-soft">
                <CardHeader className="pb-3">
                  <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => (
              <Card key={product.id} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {getCategoryName(product.category)}
                    </Badge>
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="flex items-center space-x-3">
                    <span className="text-4xl">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        getCategoryEmoji(product.category)
                      )}
                    </span>
                    <span className="text-xl">{product.name}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{product.seller_location}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Vendeur: {product.seller_name}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity_available} {product.unit} disponibles</p>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    {product.price} FCFA/{product.unit}
                  </div>
                </CardContent>
                
                <CardFooter className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: `Commande de ${product.name}`,
                        description: `Vous voulez acheter ${product.name} de ${product.seller_name}. Fonctionnalité de commande bientôt disponible !`,
                      });
                    }}
                  >
                    Acheter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Contacter le vendeur",
                        description: `Contactez ${product.seller_name} pour plus d'informations sur ce produit.`,
                      });
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => {
              toast({
                title: "Plus de produits",
                description: "Fonctionnalité de recherche avancée bientôt disponible ! Vous pourrez filtrer par région, prix et type de produits.",
              });
            }}
          >
            Voir Plus de Produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;