import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">AgriConnect Togo</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Connecter l'agriculture togolaise au monde moderne. Ensemble, 
              construisons un avenir prospère pour nos agriculteurs et notre économie locale.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#accueil" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#marche" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Marché Local
                </a>
              </li>
              <li>
                <a href="#conseils" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Conseils Agricoles
                </a>
              </li>
              <li>
                <a href="#meteo" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Météo
                </a>
              </li>
              <li>
                <a href="#financement" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Financement
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/80">Lomé, Togo</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/80">+228 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/80">contact@agriconnect.tg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="text-center">
            <h4 className="font-semibold text-lg mb-2">Restez Informé</h4>
            <p className="text-primary-foreground/80 mb-4">
              Recevez les dernières actualités agricoles et les meilleures offres du marché.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="terracotta">
                S'Abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-primary-foreground/60">
            © 2024 AgriConnect Togo. Tous droits réservés. Développé avec ❤️ pour l'agriculture togolaise.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;