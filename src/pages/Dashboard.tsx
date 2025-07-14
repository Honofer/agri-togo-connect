import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, ShoppingCart, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface TaskStats {
  products: number;
  orders: number;
  articles: number;
  applications: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    products: 0,
    orders: 0,
    articles: 0,
    applications: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchUserProfile();
      fetchUserStats();
    }
  }, [user, loading, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const profileData = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (profileData.error) throw profileData.error;

      const profileId = profileData.data.id;

      // Récupérer les statistiques selon le rôle
      const [productsData, ordersData, articlesData, applicationsData] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }).eq("seller_id", profileId),
        supabase.from("orders").select("id", { count: "exact" }).or(`buyer_id.eq.${profileId},seller_id.eq.${profileId}`),
        supabase.from("articles").select("id", { count: "exact" }).eq("author_id", profileId),
        supabase.from("credit_applications").select("id", { count: "exact" }).eq("applicant_id", profileId),
      ]);

      setStats({
        products: productsData.count || 0,
        orders: ordersData.count || 0,
        articles: articlesData.count || 0,
        applications: applicationsData.count || 0,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "farmer":
        return "Agriculteur";
      case "buyer":
        return "Acheteur";
      case "expert":
        return "Expert";
      case "admin":
        return "Administrateur";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "farmer":
        return "bg-green-100 text-green-800";
      case "buyer":
        return "bg-blue-100 text-blue-800";
      case "expert":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Erreur lors du chargement du profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du tableau de bord */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              Bienvenue, {profile.full_name}
            </p>
            <Badge className={getRoleColor(profile.role)}>
              {getRoleLabel(profile.role)}
            </Badge>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">
                Produits en vente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-muted-foreground">
                Commandes totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles}</div>
              <p className="text-xs text-muted-foreground">
                Articles publiés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">
                Demandes de crédit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions principales */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Gérez vos activités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="content">Contenu</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/")}
                  >
                    <Package className="h-8 w-8" />
                    <span>Voir le marché</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/articles")}
                  >
                    <FileText className="h-8 w-8" />
                    <span>Consulter les articles</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => {/* TODO: Ajouter navigation vers création produit */}}
                  >
                    <PlusCircle className="h-8 w-8" />
                    <span>Ajouter un produit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => {/* TODO: Ajouter navigation vers liste produits */}}
                  >
                    <Package className="h-8 w-8" />
                    <span>Gérer mes produits</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => {/* TODO: Ajouter navigation vers commandes */}}
                  >
                    <ShoppingCart className="h-8 w-8" />
                    <span>Mes commandes</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => {/* TODO: Ajouter navigation vers ventes */}}
                  >
                    <Users className="h-8 w-8" />
                    <span>Mes ventes</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => {/* TODO: Ajouter navigation vers création article */}}
                  >
                    <PlusCircle className="h-8 w-8" />
                    <span>Écrire un article</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/credit")}
                  >
                    <FileText className="h-8 w-8" />
                    <span>Demande de crédit</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;