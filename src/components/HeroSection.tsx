import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ShoppingCart, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-agriculture-togo.jpg";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Agriculture au Togo" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Connectons l'Agriculture
          <span className="block text-accent">Togolaise au Monde</span>
        </h1>
        
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          AgriConnect Togo est votre plateforme pour vendre vos produits agricoles, 
          accéder aux meilleurs conseils et faire prospérer votre exploitation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Commencer Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
            Découvrir le Marché
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-white/90">Agriculteurs Connectés</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">1000+</h3>
            <p className="text-white/90">Produits Vendus</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">50+</h3>
            <p className="text-white/90">Conseils Disponibles</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;