import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ShoppingCart, MessageSquare, Star, MapPin, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  quantity_available: number;
  minimum_order: number;
  is_organic: boolean;
  harvest_date?: string;
  expiry_date?: string;
  category: string;
  image_url?: string;
  seller_name: string;
  seller_location?: string;
  seller_phone?: string;
  created_at: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchReviews(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!seller_id (
            full_name,
            location,
            phone
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        const formattedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          unit: data.unit,
          quantity_available: data.quantity_available,
          minimum_order: data.minimum_order || 1,
          is_organic: data.is_organic || false,
          harvest_date: data.harvest_date,
          expiry_date: data.expiry_date,
          category: data.category,
          image_url: data.image_url,
          seller_name: data.profiles?.full_name || 'Vendeur anonyme',
          seller_location: data.profiles?.location,
          seller_phone: data.profiles?.phone,
          created_at: data.created_at
        };

        setProduct(formattedProduct);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviewer_id (
            full_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews = data?.map(review => ({
        id: review.id,
        reviewer_name: review.profiles?.full_name || 'Client anonyme',
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at
      })) || [];

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    }
  };

  const handleOrder = () => {
    toast({
      title: "Commande initiée",
      description: `Commande de ${quantity} ${product?.unit} de ${product?.name} ajoutée au panier. Fonctionnalité de paiement en cours de développement.`,
    });
  };

  const handleMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message envoyé",
        description: `Votre message a été envoyé à ${product?.seller_name}. Il vous répondra bientôt !`,
      });
      setMessage("");
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'cereals': '🌾',
      'vegetables': '🥕',
      'fruits': '🍎',
      'livestock': '🐄',
      'dairy': '🥛',
      'poultry': '🐔'
    };
    return emojis[category] || '🌱';
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
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
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au marché
          </Button>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="space-y-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full rounded-lg shadow-soft"
                />
              ) : (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getCategoryEmoji(product.category)}</div>
                    <p className="text-muted-foreground">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.is_organic && <Badge variant="secondary">Bio</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                <div className="text-2xl font-bold text-primary mb-4">
                  {product.price.toLocaleString()} FCFA / {product.unit}
                </div>
                
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      ({reviews.length} avis)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Disponible:</strong> {product.quantity_available} {product.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Commande minimum:</strong> {product.minimum_order} {product.unit}
                  </span>
                </div>
                {product.harvest_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Récolté le:</strong> {new Date(product.harvest_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {product.seller_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Localisation:</strong> {product.seller_location}
                    </span>
                  </div>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Order Section */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Quantité ({product.unit})
                    </label>
                    <Input
                      type="number"
                      min={product.minimum_order}
                      max={product.quantity_available}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-32"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: {(product.price * quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleOrder} className="flex-1">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Commander
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contacter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contacter {product.seller_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Votre message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                          />
                          {product.seller_phone && (
                            <p className="text-sm text-muted-foreground">
                              Téléphone: {product.seller_phone}
                            </p>
                          )}
                          <Button onClick={handleMessage} className="w-full">
                            Envoyer le message
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Avis clients ({reviews.length})
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.reviewer_name}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;