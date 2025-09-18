import type {
  Disease,
  FeatureImportance,
  Location,
  RiskData,
  TimeSeriesDataPoint,
  WeatherData,
} from '@/lib/types';
import { subDays, format } from 'date-fns';

export const diseases: Disease[] = [
  { id: 'dengue', name: 'Dengue' },
  { id: 'influenza', name: 'Influenza' },
  { id: 'malaria', name: 'Malaria' },
];

export const locations: Location[] = [
  { id: 'genland', name: 'Genland', level: 'country' },
  { id: 'genland-dhaka', name: 'Dhaka', level: 'division', parent_id: 'genland' },
  { id: 'genland-chittagong', name: 'Chittagong', level: 'division', parent_id: 'genland' },
  { id: 'dhaka-north', name: 'Dhaka North', level: 'district', parent_id: 'genland-dhaka' },
  { id: 'dhaka-south', name: 'Dhaka South', level: 'district', parent_id: 'genland-dhaka' },
  { id: 'ctg-main', name: 'Chittagong Main', level: 'district', parent_id: 'genland-chittagong' },
];

export const generateTimeSeriesData = (days = 30): TimeSeriesDataPoint[] => {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(today, days - 1 - i);
    const baseActual = 50 + Math.sin(i / 5) * 20 + Math.random() * 10;
    const actual = Math.max(0, Math.floor(baseActual));
    const predicted = Math.max(0, Math.floor(baseActual * (0.8 + Math.random() * 0.4)));
    const uncertaintyRange = predicted * 0.2;
    return {
      date: format(date, 'yyyy-MM-dd'),
      actual,
      predicted,
      uncertainty: [
        Math.max(0, Math.floor(predicted - uncertaintyRange)),
        Math.floor(predicted + uncertaintyRange),
      ],
      is_outbreak: i === days - 5 || i === days - 15 ? true : false,
    };
  });
};

export const riskData: RiskData[] = [
  { id: '1', location: 'Mirpur', risk_category: 'High', risk_score: 89, change: 12 },
  { id: '2', location: 'Gulshan', risk_category: 'Medium', risk_score: 65, change: -5 },
  { id: '3', location: 'Dhanmondi', risk_category: 'Medium', risk_score: 72, change: 8 },
  { id: '4', location: 'Savar', risk_category: 'Low', risk_score: 34, change: 2 },
  { id: '5', location: 'Uttara', risk_category: 'High', risk_score: 92, change: 15 },
];

export const featureImportanceData: FeatureImportance[] = [
    { feature: 'Rainfall (14d lag)', importance: 0.28 },
    { feature: 'Temperature (7d lag)', importance: 0.21 },
    { feature: 'Population Density', importance: 0.15 },
    { feature: 'Previous Cases (7d)', importance: 0.12 },
    { feature: 'Humidity (7d lag)', importance: -0.09 },
    { feature: 'Govt. Interventions', importance: -0.16 },
];

export const weatherData: WeatherData[] = [
    { label: 'Temperature', value: '32°C', is_extreme: true },
    { label: 'Humidity', value: '85%', is_extreme: true },
    { label: 'Rainfall', value: '15mm' },
];

export const genlandDistricts = [
    { id: 'd1', name: 'Alpha', incidence: 0.8, path: "M40,50 L100,20 L160,70 L120,130 Z" },
    { id: 'd2', name: 'Beta', incidence: 0.5, path: "M100,20 L180,25 L220,80 L160,70 Z" },
    { id: 'd3', name: 'Gamma', incidence: 0.3, path: "M160,70 L220,80 L250,150 L180,140 Z" },
    { id: 'd4', name: 'Delta', incidence: 0.9, path: "M120,130 L180,140 L250,150 L150,200 Z" },
    { id: 'd5', name: 'Epsilon', incidence: 0.1, path: "M40,50 L120,130 L60,180 Z" },
    { id: 'd6', name: 'Zeta', incidence: 0.6, path: "M220,80 L280,70 L320,130 L250,150 Z" },
];
