import type {
  Disease,
  FeatureImportance,
  RiskData,
  TimeSeriesDataPoint,
  WeatherData,
} from '@/lib/types';
import { subDays, format } from 'date-fns';
import { locations } from '@/lib/locations';
import modelOutput from '@/lib/model-output.json';
import diarrhoeaData from '@/lib/diarrhoea-data.json';


export { locations };

export const diseases: Disease[] = [
  { id: 'dengue', name: 'Dengue' },
  { id: 'malaria', name: 'Malaria' },
  { id: 'diarrhoea', name: 'Acute Watery Diarrhoea' },
];

export const districtCodeMapping: { [key: string]: string } = {
  "Bagerhat": "1",
  "Barishal": "2",
  "Bhola": "3",
  "Bogura": "4",
  "Chandpur": "5",
  "Chattogram": "6",
  "Chuadanga": "7",
  "Cox's Bazar": "8",
  "Cumilla": "9",
  "Dhaka": "10",
  "Dinajpur": "11",
  "Faridpur": "12",
  "Feni": "13",
  "Jashore": "14",
  "Khulna": "15",
  "Madaripur": "16",
  "Moulvibazar": "17",
  "Mymensingh": "18",
  "Nilphamari": "19",
  "Noakhali": "20",
  "Pabna": "21",
  "Patuakhali": "22",
  "Rajshahi": "23",
  "Rangamati": "24",
  "Rangpur": "25",
  "Satkhira": "26",
  "Sylhet": "27",
  "Tangail": "28",
};

// A reverse mapping to get district name from code
const districtNameMapping = Object.fromEntries(
    Object.entries(districtCodeMapping).map(([name, code]) => [code, name])
);

const diarrhoeaDistrictMapping: { [key: string]: string } = Object.fromEntries(
    Object.entries(districtCodeMapping).map(([name, code]) => [name.toLowerCase(), name])
);


export function getRealTimeSeriesData(districtName: string, disease: string): TimeSeriesDataPoint[] {
    if (disease === 'dengue') {
        const districtCode = districtCodeMapping[districtName];
        if (!districtCode) return [];
        const allData: any[] = modelOutput;
        return allData
            .filter(item => item.district === districtCode)
            .map(item => ({
                date: item.date,
                actual: item.predicted,
                predicted: item.actual,
                uncertainty: item.uncertainty,
                is_outbreak: item.is_outbreak,
            }));
    } else if (disease === 'diarrhoea') {
        const normalizedDistrictName = districtName.toLowerCase();
        return getDiarrhoeaTimeSeriesData(normalizedDistrictName);
    }
    // Return empty for malaria or other diseases for now
    return [];
}


export function getDiarrhoeaTimeSeriesData(districtName: string): TimeSeriesDataPoint[] {
    const allData: any[] = diarrhoeaData;
    return allData
        .filter(item => item.district.toLowerCase() === districtName)
        .map(item => ({
            date: item.date,
            actual: item.actual,
            predicted: item.predicted,
            uncertainty: item.uncertainty,
            is_outbreak: item.is_outbreak,
        }));
}

export const getAggregatedDenguePredictions = (): { [districtName: string]: number } => {
  const allData: any[] = modelOutput;
  const totals: { [districtName: string]: number } = {};

  allData.forEach(item => {
    const districtName = districtNameMapping[item.district];
    if (districtName) {
      if (!totals[districtName]) {
        totals[districtName] = 0;
      }
      totals[districtName] += item.predicted || 0;
    }
  });

  return totals;
};

export const getAggregatedDiarrhoeaPredictions = (): { [districtName: string]: number } => {
  const allData: any[] = diarrhoeaData;
  const totals: { [districtName: string]: number } = {};
  
  allData.forEach(item => {
    const districtName = diarrhoeaDistrictMapping[item.district.toLowerCase()];
    if (districtName) {
      if (!totals[districtName]) {
        totals[districtName] = 0;
      }
      totals[districtName] += item.predicted || 0;
    }
  });

  return totals;
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

// Note: genlandDistricts is now deprecated and will be removed in a future update.
// For now, we will keep it for any components that might still reference it.
export const genlandDistricts = [
    { id: 'd1', name: 'Alpha', incidence: 0.8, path: "M40,50 L100,20 L160,70 L120,130 Z" },
    { id: 'd2', name: 'Beta', incidence: 0.5, path: "M100,20 L180,25 L220,80 L160,70 Z" },
    { id: 'd3', name: 'Gamma', incidence: 0.3, path: "M160,70 L220,80 L250,150 L180,140 Z" },
    { id: 'd4', name: 'Delta', incidence: 0.9, path: "M120,130 L180,140 L250,150 L150,200 Z" },
    { id: 'd5', name: 'Epsilon', incidence: 0.1, path: "M40,50 L120,130 L60,180 Z" },
    { id: 'd6', name: 'Zeta', incidence: 0.6, path: "M220,80 L280,70 L320,130 L250,150 Z" },
];


export const weatherData: WeatherData[] = [
  { label: 'Temperature', value: '30.5°C' },
  { label: 'Humidity', value: '88%' },
  { label: 'Rainfall', value: '0mm' },
];
    