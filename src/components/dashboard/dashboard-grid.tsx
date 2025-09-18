"use client";

import { useSearchParams } from 'next/navigation';
import WeatherPanels from './weather-panels';
import TimeSeriesChart from './time-series-chart';
import {
  generateTimeSeriesData,
  riskData,
  featureImportanceData,
} from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FeatureImportanceChart from './feature-importance-chart';
import ChoroplethMap from './choropleth-map';
import RiskHeatmap from './risk-heatmap';
import { getLiveWeatherData } from '@/lib/weather';
import type { WeatherData } from '@/lib/types';
import React from 'react';

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


export default function DashboardGrid() {
  const searchParams = useSearchParams();
  const location = searchParams.get('district') || 'dhaka-dist';
  const disease = searchParams.get('disease') || 'dengue';

  const [weatherData, setWeatherData] = React.useState<WeatherData[]>([]);
  const [weatherError, setWeatherError] = React.useState(false);

  React.useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchAndFormatWeatherData();
        if (data.length === 0) {
          setWeatherError(true);
        }
        setWeatherData(data);
      } catch (e) {
        setWeatherError(true);
        console.error(e);
      }
    }
    loadWeather();
  }, []);

  // In a real app, you would fetch data based on filters
  const timeSeriesData = generateTimeSeriesData(60);

  return (
    <div className="grid flex-1 items-start gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
      <div className="grid auto-rows-max items-start gap-4 sm:gap-6 lg:col-span-3 xl:col-span-3">
        <WeatherPanels weatherData={weatherData} error={weatherError} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <TimeSeriesChart data={timeSeriesData} />
            <FeatureImportanceChart data={featureImportanceData} />
        </div>
        <ChoroplethMap />
      </div>
      <div className="grid auto-rows-max items-start gap-4 sm:gap-6 lg:col-span-3 xl:col-span-2">
        <RiskHeatmap data={riskData} />
      </div>
    </div>
  );
}
