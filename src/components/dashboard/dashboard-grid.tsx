"use client";

import { useSearchParams } from 'next/navigation';
import WeatherPanels from './weather-panels';
import TimeSeriesChart from './time-series-chart';
import {
  getRealTimeSeriesData,
  riskData,
  featureImportanceData,
  locations,
} from '@/lib/data';
import FeatureImportanceChart from './feature-importance-chart';
import ChoroplethMap from './choropleth-map';
import RiskHeatmap from './risk-heatmap';
import { getLiveWeatherData } from '@/lib/weather';
import type { WeatherData, TimeSeriesDataPoint } from '@/lib/types';
import React from 'react';

async function fetchAndFormatWeatherData(): Promise<{data: WeatherData[], error: boolean}> {
    try {
        const liveWeather = await getLiveWeatherData('Dhaka', 'BD');
        if (!liveWeather) return { data: [], error: true };

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
        return { data: weatherData, error: false };
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return { data: [], error: true };
    }
}


export default function DashboardGrid() {
  const searchParams = useSearchParams();
  const districtId = searchParams.get('district') || '47'; // Default to Dhaka district
  const disease = searchParams.get('disease') || 'dengue';

  const [weatherData, setWeatherData] = React.useState<WeatherData[]>([]);
  const [weatherError, setWeatherError] = React.useState(false);

  React.useEffect(() => {
    async function loadWeather() {
      const { data, error } = await fetchAndFormatWeatherData();
      setWeatherData(data);
      setWeatherError(error);
    }
    loadWeather();
  }, []);

  const timeSeriesData = React.useMemo(() => {
    const selectedDistrict = locations.find(l => l.id === districtId && l.level === 'district');
    const districtName = selectedDistrict ? selectedDistrict.name : 'Dhaka'; // Fallback to Dhaka
    return getRealTimeSeriesData(districtName);
  }, [districtId]);

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
