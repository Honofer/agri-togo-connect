import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FinancialInstitution {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface ApplicationForm {
  institution_id: string;
  amount_requested: number;
  purpose: string;
  notes: string;
}

const CreditApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<FinancialInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ApplicationForm>({
    institution_id: '',
    amount_requested: 0,
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_institutions')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setInstitutions(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des institutions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les institutions financières.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Simuler la création d'un profil utilisateur temporaire
      // Dans un vrai système, il faudrait une authentification
      const tempUserId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('credit_applications')
        .insert({
          applicant_id: tempUserId,
          institution_id: form.institution_id || null,
          amount_requested: form.amount_requested,
          purpose: form.purpose,
          notes: form.notes,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Demande enregistrée",
        description: "Votre demande de crédit a été enregistrée avec succès. Un conseiller vous contactera bientôt.",
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre demande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return form.institution_id !== '';
      case 2:
        return form.amount_requested > 0 && form.purpose.trim() !== '';
      case 3:
        return true; // Notes are optional
      default:
        return false;
    }
  };

  const selectedInstitution = institutions.find(inst => inst.id === form.institution_id);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Demande de Crédit Agricole
            </h1>
            <p className="text-lg text-muted-foreground">
              Complétez votre demande de financement en quelques étapes simples
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-0.5 ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {currentStep === 1 && "Choisir une Institution"}
                {currentStep === 2 && "Détails du Financement"}
                {currentStep === 3 && "Informations Complémentaires"}
                {currentStep === 4 && "Demande Enregistrée"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Choose Institution */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="institution">Institution Financière *</Label>
                    <Select
                      value={form.institution_id}
                      onValueChange={(value) => setForm({ ...form, institution_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name} ({institution.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedInstitution?.description && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">À propos de {selectedInstitution.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedInstitution.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Financing Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Montant demandé (FCFA) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Ex: 500000"
                      value={form.amount_requested || ''}
                      onChange={(e) => setForm({ ...form, amount_requested: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">Objet du financement *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Décrivez l'utilisation prévue des fonds (ex: Achat de semences, équipement agricole, etc.)"
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Informations complémentaires (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ajoutez toute information qui pourrait être utile pour l'évaluation de votre demande"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Documents généralement requis :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pièce d'identité</li>
                      <li>• Justificatifs de revenus</li>
                      <li>• Plan d'affaires agricole</li>
                      <li>• Titre de propriété foncière (si applicable)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Un conseiller vous contactera pour finaliser votre dossier.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Demande enregistrée avec succès !
                    </h3>
                    <p className="text-muted-foreground">
                      Votre demande de crédit de {form.amount_requested.toLocaleString()} FCFA 
                      a été transmise à {selectedInstitution?.name}.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Prochaines étapes :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>1. Un conseiller vous contactera sous 48h</li>
                      <li>2. Préparation des documents requis</li>
                      <li>3. Évaluation de votre dossier</li>
                      <li>4. Décision de financement</li>
                    </ul>
                  </div>
                  <Button onClick={() => navigate('/')} className="w-full">
                    Retour à l'accueil
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Précédent
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepValid(currentStep)}
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !isStepValid(currentStep)}
                      >
                        {submitting ? "Envoi en cours..." : "Envoyer la demande"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditApplication;