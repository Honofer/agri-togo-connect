import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, PiggyBank, TrendingUp, Users, FileText, CheckCircle, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface FinancialInstitution {
  id: string;
  name: string;
  type: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

interface CreditApplication {
  id: string;
  amount_requested: number;
  purpose: string;
  status: string;
  application_date: string;
  institution_name?: string;
}

const FinancingSection = () => {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<FinancialInstitution[]>([]);
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'bank': return CreditCard;
      case 'microfinance': return Users;
      case 'government': return PiggyBank;
      default: return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'rejected': return 'text-destructive';
      case 'under_review': return 'text-primary';
      case 'pending': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'draft': 'Brouillon',
      'submitted': 'Soumise',
      'under_review': 'En cours de révision',
      'approved': 'Approuvée',
      'rejected': 'Rejetée',
      'disbursed': 'Versée'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    fetchFinancingData();
  }, []);

  const fetchFinancingData = async () => {
    try {
      // Récupérer les institutions financières
      const { data: institutionsData, error: institutionsError } = await supabase
        .from('financial_institutions')
        .select('*')
        .eq('is_active', true)
        .order('type');

      if (institutionsError) throw institutionsError;

      // Récupérer quelques demandes de crédit récentes (pour l'affichage statistique)
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('credit_applications')
        .select(`
          *,
          financial_institutions (
            name
          )
        `)
        .order('application_date', { ascending: false })
        .limit(5);

      if (applicationsError) throw applicationsError;

      const formattedApplications = applicationsData?.map(app => ({
        id: app.id,
        amount_requested: app.amount_requested,
        purpose: app.purpose,
        status: app.status,
        application_date: app.application_date,
        institution_name: app.financial_institutions?.name
      })) || [];

      setInstitutions(institutionsData || []);
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Erreur lors du chargement des données de financement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les options de financement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Financing Institutions */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Institutions Partenaires</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card shadow-soft">
                  <CardHeader className="pb-4">
                    <div className="animate-pulse">
                      <div className="h-6 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutions.map((institution) => {
                const IconComponent = getInstitutionIcon(institution.type);
                return (
                  <Card key={institution.id} className="bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{institution.type}</Badge>
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{institution.name}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {institution.description && (
                        <p className="text-muted-foreground text-sm">{institution.description}</p>
                      )}
                      
                      <div className="space-y-2">
                        {institution.contact_email && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Email:</span>
                            <span className="text-sm text-primary">{institution.contact_email}</span>
                          </div>
                        )}
                        {institution.contact_phone && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Téléphone:</span>
                            <span className="text-sm">{institution.contact_phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: `Contact ${institution.name}`,
                            description: `Vous souhaitez contacter ${institution.name}. Un conseiller vous rappellera bientôt !`,
                          });
                        }}
                      >
                        Demander Informations
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Applications Stats */}
        {applications.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Demandes Récentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.slice(0, 3).map((application) => (
                <Card key={application.id} className="bg-gradient-card shadow-soft">
                  <CardHeader className="text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Demande de Crédit</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="text-2xl font-bold text-primary">
                      {application.amount_requested.toLocaleString()} FCFA
                    </div>
                    <p className="text-sm text-muted-foreground">{application.purpose}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Statut: </span>
                      <span className={getStatusColor(application.status)}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    {application.institution_name && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Institution: </span>
                        {application.institution_name}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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