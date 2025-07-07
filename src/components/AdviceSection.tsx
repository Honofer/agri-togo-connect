import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Droplets, Sun, Sprout, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdviceSection = () => {
  const { toast } = useToast();
  const adviceCards = [
    {
      icon: Droplets,
      title: "Gestion de l'Eau",
      description: "Techniques d'irrigation efficaces pour maximiser vos rendements même en saison sèche.",
      tips: ["Irrigation goutte à goutte", "Conservation de l'eau de pluie", "Calendrier d'arrosage optimal"]
    },
    {
      icon: Sprout,
      title: "Préparation du Sol",
      description: "Comment préparer et enrichir votre sol pour des cultures plus productives.",
      tips: ["Compostage naturel", "Rotation des cultures", "Test de pH du sol"]
    },
    {
      icon: Sun,
      title: "Météo et Saisons",
      description: "Adapter vos cultures aux conditions climatiques du Togo pour un meilleur succès.",
      tips: ["Calendrier de plantation", "Protection contre les intempéries", "Prévisions météo locales"]
    },
    {
      icon: TrendingUp,
      title: "Augmenter les Rendements",
      description: "Stratégies éprouvées pour améliorer la productivité de vos cultures.",
      tips: ["Sélection de semences", "Fertilisation organique", "Contrôle des nuisibles"]
    },
    {
      icon: Users,
      title: "Coopératives Agricoles",
      description: "L'importance de rejoindre une coopérative pour partager les ressources et connaissances.",
      tips: ["Avantages du regroupement", "Négociation de prix", "Partage d'équipements"]
    },
    {
      icon: BookOpen,
      title: "Formation Continue",
      description: "Ressources pour apprendre de nouvelles techniques agricoles modernes.",
      tips: ["Ateliers pratiques", "Formations en ligne", "Échanges entre agriculteurs"]
    }
  ];

  return (
    <section id="conseils" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Conseils Agricoles
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez aux meilleures pratiques agricoles adaptées au climat et aux sols togolais. 
            Nos experts partagent leurs connaissances pour améliorer vos rendements.
          </p>
        </div>

        {/* Advice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adviceCards.map((advice, index) => (
            <Card key={index} className="bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <advice.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">{advice.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  {advice.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Points clés :</h4>
                  <ul className="space-y-1">
                    {advice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    toast({
                      title: `Guide: ${advice.title}`,
                      description: `Découvrez nos conseils détaillés sur ${advice.title.toLowerCase()}. Guide complet bientôt disponible !`,
                    });
                  }}
                >
                  En Savoir Plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Article */}
        <div className="bg-gradient-card rounded-lg p-8 shadow-soft">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Article du Mois : Culture du Maïs en Saison Sèche
              </h3>
              <p className="text-muted-foreground mb-6">
                Découvrez les techniques innovantes pour cultiver le maïs même pendant 
                la saison sèche au Togo. Des méthodes éprouvées par nos agriculteurs partenaires.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="success"
                  onClick={() => {
                    toast({
                      title: "Article du Mois",
                      description: "Téléchargement de l'article sur la culture du maïs en saison sèche... Fonctionnalité bientôt disponible !",
                    });
                  }}
                >
                  Lire l'Article
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Guide PDF",
                      description: "Téléchargement du guide PDF en cours... Fonctionnalité bientôt disponible !",
                    });
                  }}
                >
                  Télécharger PDF
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">📚</div>
              <p className="text-sm text-muted-foreground">
                Guide complet avec illustrations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdviceSection;