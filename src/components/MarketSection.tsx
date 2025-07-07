import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone } from "lucide-react";

const MarketSection = () => {
  const products = [
    {
      id: 1,
      name: "Maïs Bio",
      seller: "Koffi Mensah",
      location: "Lomé, Maritime",
      price: "800 FCFA/kg",
      quantity: "50 kg disponibles",
      rating: 4.8,
      image: "🌽",
      category: "Céréales"
    },
    {
      id: 2,
      name: "Manioc Frais",
      seller: "Ama Adjoa",
      location: "Kara, Kara",
      price: "600 FCFA/kg",
      quantity: "100 kg disponibles",
      rating: 4.9,
      image: "🍠",
      category: "Tubercules"
    },
    {
      id: 3,
      name: "Igname de Qualité",
      seller: "Kwame Asante",
      location: "Sokodé, Centrale",
      price: "1200 FCFA/kg",
      quantity: "30 kg disponibles",
      rating: 4.7,
      image: "🍯",
      category: "Tubercules"
    },
    {
      id: 4,
      name: "Tomates Rouges",
      seller: "Akosua Tano",
      location: "Atakpamé, Plateaux",
      price: "500 FCFA/kg",
      quantity: "25 kg disponibles",
      rating: 4.6,
      image: "🍅",
      category: "Légumes"
    },
    {
      id: 5,
      name: "Haricots Blancs",
      seller: "Yao Kpodo",
      location: "Dapaong, Savanes",
      price: "900 FCFA/kg",
      quantity: "40 kg disponibles",
      rating: 4.8,
      image: "🫘",
      category: "Légumineuses"
    },
    {
      id: 6,
      name: "Plantains Mûrs",
      seller: "Esi Akoto",
      location: "Tsévié, Maritime",
      price: "400 FCFA/kg",
      quantity: "60 kg disponibles",
      rating: 4.5,
      image: "🍌",
      category: "Fruits"
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="flex items-center space-x-3">
                  <span className="text-4xl">{product.image}</span>
                  <span className="text-xl">{product.name}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{product.location}</span>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Vendeur: {product.seller}</p>
                  <p className="text-sm text-muted-foreground">{product.quantity}</p>
                </div>
                
                <div className="text-2xl font-bold text-primary">
                  {product.price}
                </div>
              </CardContent>
              
              <CardFooter className="flex space-x-2">
                <Button variant="default" size="sm" className="flex-1">
                  Acheter
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg">
            Voir Plus de Produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;