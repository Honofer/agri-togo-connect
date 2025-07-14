import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  conditions: string;
  date: string;
}

interface WeatherAlert {
  id: string;
  location: string;
  type: string;
  title: string;
  description: string;
  severity: number;
  start_date: string;
  end_date?: string;
}

const WeatherSection = () => {
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const getWeatherIcon = (conditions: string) => {
    const condition = conditions.toLowerCase();
    if (condition.includes('ensoleillé') || condition.includes('sun')) return Sun;
    if (condition.includes('pluie') || condition.includes('rain')) return CloudRain;
    if (condition.includes('nuageux') || condition.includes('cloud')) return Cloud;
    return Sun;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm': return CloudRain;
      case 'drought': return Sun;
      case 'flood': return Droplets;
      case 'frost': return Thermometer;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (severity: number) => {
    if (severity >= 4) return 'text-destructive';
    if (severity >= 3) return 'text-orange-500';
    return 'text-yellow-500';
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Récupérer les données météo récentes
      const { data: weather, error: weatherError } = await supabase
        .from('weather_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(6);

      if (weatherError) throw weatherError;

      // Récupérer les alertes météo actives
      const { data: alerts, error: alertsError } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .order('severity', { ascending: false });

      if (alertsError) throw alertsError;

      setWeatherData(weather || []);
      setWeatherAlerts(alerts || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données météo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données météo. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="meteo" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Météo Agricole
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Suivez les conditions météorologiques en temps réel pour optimiser vos activités agricoles. 
            Planifiez vos semis, récoltes et irrigation selon les prévisions locales.
          </p>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Alertes Météo Actives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <Card key={alert.id} className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertIcon className={`h-6 w-6 ${getAlertColor(alert.severity)} flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{alert.location}</span>
                            <span className={`font-medium ${getAlertColor(alert.severity)}`}>
                              Niveau {alert.severity}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Weather Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gradient-card shadow-soft">
                <CardHeader className="text-center pb-4">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-2">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : weatherData.length === 0 ? (
          <div className="text-center py-12 mb-12">
            <p className="text-muted-foreground text-lg">Aucune donnée météo disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {weatherData.slice(0, 3).map((weather, index) => {
              const WeatherIcon = getWeatherIcon(weather.conditions);
              return (
                <Card key={weather.id} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{weather.location}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(weather.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <WeatherIcon className="h-12 w-12 text-accent" />
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {weather.temperature}°C
                      </div>
                      <p className="text-muted-foreground">{weather.conditions}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-primary" />
                        <span className="text-sm">{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wind className="h-4 w-4 text-primary" />
                        <span className="text-sm">{weather.wind_speed} km/h</span>
                      </div>
                    </div>
                    
                    {weather.precipitation > 0 && (
                      <div className="flex items-center space-x-2">
                        <CloudRain className="h-4 w-4 text-primary" />
                        <span className="text-sm">Précipitations: {weather.precipitation}mm</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Agricultural Weather Tips */}
        <div className="bg-primary/5 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Conseils Météo pour l'Agriculture
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🌱 Plantation</h4>
              <p className="text-muted-foreground text-sm">
                Plantez après les dernières pluies fortes. Vérifiez l'humidité du sol avant les semis.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">💧 Irrigation</h4>
              <p className="text-muted-foreground text-sm">
                Arrosez tôt le matin ou le soir. Réduisez l'irrigation avant les pluies prévues.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🌾 Récolte</h4>
              <p className="text-muted-foreground text-sm">
                Récoltez par temps sec. Évitez les jours de forte humidité pour le séchage.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🛡️ Protection</h4>
              <p className="text-muted-foreground text-sm">
                Protégez vos cultures des vents forts et de la grêle avec des bâches.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button 
              variant="hero"
              onClick={() => {
                toast({
                  title: "Alertes Météo",
                  description: "Inscription aux alertes météo confirmée ! Vous recevrez des notifications importantes par SMS et email.",
                });
              }}
            >
              Recevoir Alertes Météo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherSection;