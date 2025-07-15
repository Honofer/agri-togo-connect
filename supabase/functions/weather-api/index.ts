import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface pour les données météo de l'API externe
interface WeatherApiResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    wind_speed_10m: number
    weather_code: number
  }
}

// Fonction pour obtenir la description météo selon le code
function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Ciel dégagé',
    1: 'Principalement dégagé',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine modérée',
    55: 'Bruine dense',
    61: 'Pluie légère',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    71: 'Neige légère',
    73: 'Neige modérée',
    75: 'Neige forte',
    80: 'Averses légères',
    81: 'Averses modérées',
    82: 'Averses violentes',
    95: 'Orage',
    96: 'Orage avec grêle'
  }
  
  return weatherCodes[code] || 'Conditions inconnues'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      'https://mlrrnqgktdpenwxxslml.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scnJucWdrdGRwZW53eHhzbG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTA3MzQsImV4cCI6MjA2NzQyNjczNH0.389kGZZwHD1aJKomGVJ7rjHOMxSQnESLTXv-t6yYr-g'
    )

    const url = new URL(req.url)
    const location = url.searchParams.get('location') || 'Lomé, Togo'
    
    // Coordonnées par défaut pour Lomé, Togo
    let latitude = 6.1375
    let longitude = 1.2123
    
    // Vous pouvez ajouter ici une logique pour obtenir les coordonnées basées sur la location
    
    // Appel à l'API Open-Meteo (gratuite et sans clé API)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`
    
    console.log('Fetching weather data from:', weatherUrl)
    
    const weatherResponse = await fetch(weatherUrl)
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`)
    }
    
    const weatherData: WeatherApiResponse = await weatherResponse.json()
    
    // Transformation des données pour notre format
    const processedWeatherData = {
      location,
      temperature: Math.round(weatherData.current.temperature_2m),
      humidity: weatherData.current.relative_humidity_2m,
      precipitation: weatherData.current.precipitation,
      wind_speed: Math.round(weatherData.current.wind_speed_10m * 10) / 10,
      conditions: getWeatherDescription(weatherData.current.weather_code),
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    }

    // Insérer les données dans la base de données
    const { error: insertError } = await supabase
      .from('weather_data')
      .insert(processedWeatherData)

    if (insertError) {
      console.error('Error inserting weather data:', insertError)
    }

    console.log('Weather data processed successfully:', processedWeatherData)

    return new Response(
      JSON.stringify(processedWeatherData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in weather-api function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la récupération des données météo',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})