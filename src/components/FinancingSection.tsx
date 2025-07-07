import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, PiggyBank, TrendingUp, Users, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FinancingSection = () => {
  const { toast } = useToast();
  const financingOptions = [
    {
      title: "Micro-crédit Agricole",
      provider: "Banque Togolaise de Développement",
      amount: "50,000 - 500,000 FCFA",
      interest: "12% par an",
      duration: "6-12 mois",
      description: "Crédit adapté aux petits exploitants pour l'achat de semences et d'équipements.",
      requirements: ["Pièce d'identité", "Attestation d'exploitation", "Caution solidaire"],
      icon: CreditCard,
      badge: "Populaire"
    },
    {
      title: "Financement Coopératif",
      provider: "Union des Coopératives du Togo",
      amount: "100,000 - 1,000,000 FCFA",
      interest: "8% par an",
      duration: "12-24 mois",
      description: "Prêt collectif pour les membres de coopératives agricoles.",
      requirements: ["Membre d'une coopérative", "Plan d'affaires", "Garantie collective"],
      icon: Users,
      badge: "Recommandé"
    },
    {
      title: "Épargne Agricole",
      provider: "Caisse d'Épargne Rurale",
      amount: "Selon épargne",
      interest: "5% par an",
      duration: "Flexible",
      description: "Compte d'épargne spécial avec prêts basés sur votre épargne.",
      requirements: ["Dépôt minimum 10,000 FCFA", "Activité agricole prouvée"],
      icon: PiggyBank,
      badge: "Sécurisé"
    }
  ];

  const grants = [
    {
      name: "Programme PASA",
      amount: "200,000 FCFA",
      description: "Subvention pour l'amélioration de la productivité agricole",
      deadline: "31 Mars 2024"
    },
    {
      name: "Fonds Jeunes Agriculteurs",
      amount: "300,000 FCFA", 
      description: "Aide aux jeunes de moins de 35 ans pour démarrer leur exploitation",
      deadline: "15 Avril 2024"
    },
    {
      name: "Subvention Bio",
      amount: "150,000 FCFA",
      description: "Soutien à la conversion vers l'agriculture biologique",
      deadline: "30 Juin 2024"
    }
  ];

  return (
    <section id="financement" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Financement Agricole
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez aux meilleures options de financement pour développer votre exploitation agricole. 
            Crédits, subventions et programmes d'épargne adaptés à vos besoins.
          </p>
        </div>

        {/* Financing Options */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Options de Crédit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financingOptions.map((option, index) => (
              <Card key={index} className="bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{option.badge}</Badge>
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{option.provider}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Montant:</span>
                      <span className="text-sm text-primary font-semibold">{option.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Taux:</span>
                      <span className="text-sm">{option.interest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Durée:</span>
                      <span className="text-sm">{option.duration}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Requis:</h4>
                    <ul className="space-y-1">
                      {option.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-xs text-muted-foreground flex items-start">
                          <CheckCircle className="h-3 w-3 text-success mr-2 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: `Demande de ${option.title}`,
                        description: `Vous voulez faire une demande pour ${option.title}. Notre équipe vous contactera bientôt !`,
                      });
                    }}
                  >
                    Faire une Demande
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Grants Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Subventions Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grants.map((grant, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft">
                <CardHeader className="text-center">
                  <FileText className="h-8 w-8 text-success mx-auto mb-2" />
                  <CardTitle className="text-lg">{grant.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="text-2xl font-bold text-success">{grant.amount}</div>
                  <p className="text-sm text-muted-foreground">{grant.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Deadline: </span>{grant.deadline}
                  </div>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: `Candidature ${grant.name}`,
                        description: `Votre candidature pour ${grant.name} a été envoyée ! Nous reviendrons vers vous sous 48h.`,
                      });
                    }}
                  >
                    Postuler
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Education */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Formation Financière Gratuite
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Apprenez à gérer vos finances agricoles, planifier vos investissements et maximiser votre rentabilité 
            avec nos ateliers gratuits dispensés par des experts financiers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero"
              onClick={() => {
                toast({
                  title: "Inscription aux Ateliers",
                  description: "Inscription confirmée ! Vous recevrez un email avec les détails des prochains ateliers de formation financière.",
                });
              }}
            >
              S'inscrire aux Ateliers
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Guide PDF",
                  description: "Téléchargement du guide de gestion financière agricole en cours... Fonctionnalité bientôt disponible !",
                });
              }}
            >
              Télécharger Guide PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;