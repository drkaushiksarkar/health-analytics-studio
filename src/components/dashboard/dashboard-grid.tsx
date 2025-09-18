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

export default function DashboardGrid() {
  const searchParams = useSearchParams();
  const location = searchParams.get('district') || 'dhaka-north';
  const disease = searchParams.get('disease') || 'dengue';

  // In a real app, you would fetch data based on filters
  const timeSeriesData = generateTimeSeriesData(60);

  return (
    <div className="grid flex-1 items-start gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
      <div className="grid auto-rows-max items-start gap-4 sm:gap-6 lg:col-span-3 xl:col-span-3">
        <WeatherPanels />
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
