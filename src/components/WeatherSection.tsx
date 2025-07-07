import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeatherSection = () => {
  const { toast } = useToast();
  const weatherData = [
    {
      city: "Lomé",
      region: "Maritime",
      temperature: "28°C",
      condition: "Ensoleillé",
      humidity: "75%",
      wind: "15 km/h",
      icon: Sun,
      forecast: [
        { day: "Lun", temp: "29°C", icon: Sun },
        { day: "Mar", temp: "27°C", icon: CloudRain },
        { day: "Mer", temp: "26°C", icon: Cloud },
      ]
    },
    {
      city: "Kara",
      region: "Kara",
      temperature: "25°C",
      condition: "Nuageux",
      humidity: "68%",
      wind: "12 km/h",
      icon: Cloud,
      forecast: [
        { day: "Lun", temp: "26°C", icon: Cloud },
        { day: "Mar", temp: "24°C", icon: CloudRain },
        { day: "Mer", temp: "25°C", icon: Sun },
      ]
    },
    {
      city: "Sokodé",
      region: "Centrale",
      temperature: "23°C",
      condition: "Pluie légère",
      humidity: "82%",
      wind: "8 km/h",
      icon: CloudRain,
      forecast: [
        { day: "Lun", temp: "24°C", icon: CloudRain },
        { day: "Mar", temp: "22°C", icon: CloudRain },
        { day: "Mer", temp: "25°C", icon: Cloud },
      ]
    }
  ];

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

        {/* Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {weatherData.map((weather, index) => (
            <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{weather.city}</h3>
                    <p className="text-sm text-muted-foreground">{weather.region}</p>
                  </div>
                  <weather.icon className="h-12 w-12 text-accent" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {weather.temperature}
                  </div>
                  <p className="text-muted-foreground">{weather.condition}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="text-sm">{weather.humidity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-sm">{weather.wind}</span>
                  </div>
                </div>
                
                {/* 3-day forecast */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Prévisions 3 jours</h4>
                  <div className="flex justify-between">
                    {weather.forecast.map((day, dayIndex) => (
                      <div key={dayIndex} className="text-center">
                        <p className="text-xs text-muted-foreground">{day.day}</p>
                        <day.icon className="h-4 w-4 mx-auto my-1 text-accent" />
                        <p className="text-xs font-medium">{day.temp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  description: "Système d'alertes météo agricoles bientôt disponible ! Vous recevrez des notifications par SMS pour protéger vos cultures.",
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