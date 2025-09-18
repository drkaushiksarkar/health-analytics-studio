import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLiveWeatherData } from '@/lib/weather';
import { Thermometer, Droplets, CloudRain, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WeatherData } from '@/lib/types';

const iconMap = {
  Temperature: Thermometer,
  Humidity: Droplets,
  Rainfall: CloudRain,
};

async function fetchAndFormatWeatherData(): Promise<WeatherData[]> {
    try {
        const liveWeather = await getLiveWeatherData('Dhaka', 'BD');
        if (!liveWeather) return [];

        const { temp, humidity, rainfall } = liveWeather;
        
        const weatherData: WeatherData[] = [
            { 
                label: 'Temperature', 
                value: `${temp.toFixed(1)}°C`, 
                is_extreme: temp > 35 
            },
            { 
                label: 'Humidity', 
                value: `${humidity}%`, 
                is_extreme: humidity > 90 
            },
            { 
                label: 'Rainfall', 
                value: `${rainfall}mm`,
                is_extreme: rainfall > 20 // threshold for heavy rainfall in an hour
            },
        ];
        return weatherData;
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return [];
    }
}

export default async function WeatherPanels() {
  const weatherData = await fetchAndFormatWeatherData();

  if (!weatherData || weatherData.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center p-4 sm:col-span-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="mt-2 text-sm font-medium text-destructive">Could not load weather data.</p>
            <p className="text-xs text-muted-foreground">Please check API key or network.</p>
        </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {weatherData.map((item) => {
        const Icon = iconMap[item.label];
        return (
          <Card key={item.label} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={cn('text-2xl font-bold', item.is_extreme && 'text-destructive')}
              >
                {item.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
