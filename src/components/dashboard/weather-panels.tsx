import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { weatherData } from '@/lib/data';
import { Thermometer, Droplets, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Temperature: Thermometer,
  Humidity: Droplets,
  Rainfall: CloudRain,
};

export default function WeatherPanels() {
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
