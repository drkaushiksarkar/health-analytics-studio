"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl, { Map, LngLatBoundsLike } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import Papa from 'papaparse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MapLegend = ({ title, stops, labels }: { title: string, stops: [number, string][], labels: string[] }) => (
  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
    <h3 className="font-semibold text-sm mb-2">{title}</h3>
    <div className="flex flex-col gap-1">
      {stops.map(([value, color], i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ backgroundColor: color }} className="w-4 h-4 rounded-sm border border-black/20" />
          <span className="text-xs">{labels[i]}</span>
        </div>
      ))}
    </div>
  </div>
);

type MalariaSpecies = 'vivax' | 'falciparum' | 'mixed';

export default function MalariaMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [monthIndex, setMonthIndex] = useState(0);
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [species, setSpecies] = useState<MalariaSpecies>('vivax');

  const colorStops: [number, string][] = useMemo(() => [
    [-Infinity, '#2c7bb6'],
    [-8.70e-6, '#abd9e9'],
    [-1.23e-6, '#ffffbf'],
    [0, '#fee090'],
    [4.40e-6, '#fdae61'],
    [1.03e-4, '#f46d43'],
    [2.41e-4, '#d73027']
  ], []);

  const legendLabels = useMemo(() => [
    'Very low (≤ -8.70e-06)',
    'Low (-8.70e-06 to -1.23e-06)',
    'Slightly below baseline (-1.23e-06 to 0)',
    'Slightly above baseline (0 to 4.40e-06)',
    'Elevated (4.40e-06 to 1.03e-04)',
    'High (1.03e-04 to 2.41e-04)',
    'Very high (≥ 2.41e-04)'
  ], []);

  const monthLabels = useMemo(() => [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ], []);

  useEffect(() => {
    async function loadData() {
      try {
        const [geojsonRes, csvRes] = await Promise.all([
          fetch('/geo/malaria.geojson'),
          fetch('/geo/malaria_species_predictions.csv')
        ]);

        if (!geojsonRes.ok || !csvRes.ok) {
            console.error("Failed to fetch map data");
            return;
        }

        const geojson = await geojsonRes.json();
        const csvText = await csvRes.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true, // This is crucial to parse numbers correctly
          complete: (results) => {
            const predictionsByUpazila: { [key: string]: any } = {};
            (results.data as any[]).forEach((row: any) => {
              if (row.UpazilaID) {
                predictionsByUpazila[row.UpazilaID] = row;
              }
            });

            geojson.features.forEach((feature: any) => {
              const upazilaId = feature.properties.UpazilaID;
              const predictions = predictionsByUpazila[upazilaId];
              if (predictions) {
                monthLabels.forEach((month) => {
                    const monthStr = month.substring(5,7); // 01, 02...
                    feature.properties[`rate_vivax_${monthStr}`] = predictions[`rate_vivax_${month}`] ?? 0;
                    feature.properties[`rate_falciparum_${monthStr}`] = predictions[`rate_falciparum_${month}`] ?? 0;
                    feature.properties[`rate_mixed_${monthStr}`] = predictions[`rate_mixed_${month}`] ?? 0;
                });
              }
            });
            setGeojsonData(geojson);
          }
        });
      } catch (error) {
          console.error("Error loading map data:", error);
      }
    }

    loadData();
  }, [monthLabels]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current || !geojsonData) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          }
        },
        layers: [
          { id: 'osm-raster', type: 'raster', source: 'osm' }
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: [91.8, 22.3],
      zoom: 7,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

    map.on('load', () => {
      map.addSource('malaria-data', {
        type: 'geojson',
        data: geojsonData
      });
      
      const currentMonthLabel = monthLabels[monthIndex].substring(5,7);
      const riskProperty = `rate_${species}_${currentMonthLabel}`;

      map.addLayer({
        id: 'malaria-fill',
        type: 'fill',
        source: 'malaria-data',
        paint: {
          'fill-color': [
            'step',
            ['get', riskProperty],
            colorStops[0][1], // Default color
            ...colorStops.slice(1).flat()
          ],
          'fill-opacity': 0.7,
        }
      });
      
      map.addLayer({
        id: 'malaria-outline',
        type: 'line',
        source: 'malaria-data',
        paint: { 'line-width': 0.5, 'line-color': '#333' }
      });
      
      try {
        const bbox = turf.bbox(geojsonData) as LngLatBoundsLike;
        map.fitBounds(bbox, { padding: 24 });
      } catch (e) {
          console.error("Could not fit bounds", e);
      }
    });

    return () => {
        mapRef.current?.remove();
        mapRef.current = null;
    }
  }, [geojsonData]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !geojsonData) return;
    
    const currentMonthLabel = monthLabels[monthIndex].substring(5,7);
    const riskProperty = `rate_${species}_${currentMonthLabel}`;

    map.setPaintProperty('malaria-fill', 'fill-color', [
        'step',
        ['get', riskProperty],
        colorStops[0][1],
        ...colorStops.slice(1).flat()
    ]);
    
    // Clear previous listeners
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
    map.off('mousemove', 'malaria-fill');
    map.off('mouseleave', 'malaria-fill');
    
    map.on('mousemove', 'malaria-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        const p = f.properties || {};
        const rate = p[riskProperty];
        const html = `<div style="font-size:12px; color: #000;"><b>Upazila:</b> ${p.UpazilaNameEng || ''}<br/><b>Risk Rate:</b> ${rate !== undefined ? rate.toExponential(2) : 'No data'}</div>`;
        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'malaria-fill', () => {
        popup.remove();
        map.getCanvas().style.cursor = '';
    });

  }, [monthIndex, species, geojsonData, colorStops, monthLabels]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Malaria Geospatial Risk Map</CardTitle>
        <CardDescription>
          Monthly simulated malaria risk by upazila.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                <MapLegend title="Malaria Risk Rate" stops={colorStops} labels={legendLabels} />
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md max-w-xs space-y-2">
                    <Label htmlFor="species-select">Species</Label>
                    <Select value={species} onValueChange={(value) => setSpecies(value as MalariaSpecies)}>
                        <SelectTrigger id="species-select">
                            <SelectValue placeholder="Select Species" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vivax">Vivax</SelectItem>
                            <SelectItem value="falciparum">Falciparum</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div ref={containerRef} style={{ height: '550px' }} className="rounded-lg overflow-hidden shadow" />
            <div className="grid gap-2 pt-4">
                <Label htmlFor="month-slider">Month: {monthLabels[monthIndex]}</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        id="month-slider"
                        min={0}
                        max={11}
                        step={1}
                        value={[monthIndex]}
                        onValueChange={(value) => setMonthIndex(value[0])}
                    />
                    <span className="text-sm font-medium w-24 text-center">{monthLabels[monthIndex]}</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
