import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              AgriConnect Togo
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#accueil" className="text-foreground hover:text-primary transition-colors">
              Accueil
            </a>
            <a href="#marche" className="text-foreground hover:text-primary transition-colors">
              Marché
            </a>
            <a href="#conseils" className="text-foreground hover:text-primary transition-colors">
              Conseils
            </a>
            <a href="#meteo" className="text-foreground hover:text-primary transition-colors">
              Météo
            </a>
            <a href="#financement" className="text-foreground hover:text-primary transition-colors">
              Financement
            </a>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Connexion",
                  description: "Fonctionnalité de connexion bientôt disponible ! Vous pourrez créer votre compte agriculteur.",
                });
              }}
            >
              Connexion
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col space-y-4 p-4">
              <a href="#accueil" className="text-foreground hover:text-primary transition-colors">
                Accueil
              </a>
              <a href="#marche" className="text-foreground hover:text-primary transition-colors">
                Marché
              </a>
              <a href="#conseils" className="text-foreground hover:text-primary transition-colors">
                Conseils
              </a>
              <a href="#meteo" className="text-foreground hover:text-primary transition-colors">
                Météo
              </a>
              <a href="#financement" className="text-foreground hover:text-primary transition-colors">
                Financement
              </a>
              <Button 
                variant="default" 
                size="sm" 
                className="w-fit"
                onClick={() => {
                  toast({
                    title: "Connexion",
                    description: "Fonctionnalité de connexion bientôt disponible ! Vous pourrez créer votre compte agriculteur.",
                  });
                }}
              >
                Connexion
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;