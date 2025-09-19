import DistrictSatelliteMap from '@/components/dashboard/DistrictSatelliteMap';

export default function DistrictsMapPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-3">Satellite Map — Districts</h1>
      <DistrictSatelliteMap height="calc(100vh - 160px)" showLabelsDefault={false} />
    </main>
  );
}
