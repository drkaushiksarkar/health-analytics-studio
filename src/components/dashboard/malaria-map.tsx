"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl, { Map, LngLatBoundsLike } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import Papa from 'papaparse';

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

export default function MalariaMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [monthIndex, setMonthIndex] = useState(0);
  const [geojsonData, setGeojsonData] = useState<any>(null);

  const colorStops: [number, string][] = useMemo(() => [
    [-Infinity, '#2c7bb6'],     // Very low
    [-8.70e-6, '#abd9e9'],      // Low
    [-1.23e-6, '#ffffbf'],      // Slightly below baseline
    [0, '#fee090'],             // Slightly above baseline
    [4.40e-6, '#fdae61'],       // Elevated
    [1.03e-4, '#f46d43'],       // High
    [2.41e-4, '#d73027']        // Very high
  ], []);

  const legendLabels = [
    'Very low (≤ -8.70e-06)',
    'Low (-8.70e-06 to -1.23e-06)',
    'Slightly below baseline (-1.23e-06 to 0)',
    'Slightly above baseline (0 to 4.40e-06)',
    'Elevated (4.40e-06 to 1.03e-04)',
    'High (1.03e-04 to 2.41e-04)',
    'Very high (≥ 2.41e-04)'
  ];


  const monthLabels = useMemo(() => [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ], []);

  useEffect(() => {
    async function loadData() {
      try {
        const [geojsonRes, csvRes] = await Promise.all([
          fetch('/geo/malaria.geojson'),
          fetch('/geo/malaria_predictions.csv')
        ]);

        if (!geojsonRes.ok || !csvRes.ok) {
            console.error("Failed to fetch map data");
            return;
        }

        const geojson = await geojsonRes.json();
        const csvText = await csvRes.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
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
                monthLabels.forEach((month, index) => {
                  feature.properties[`rate_${index}`] = predictions[month] || 0;
                });
              } else {
                 monthLabels.forEach((month, index) => {
                  feature.properties[`rate_${index}`] = 0;
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
    if (!containerRef.current || !geojsonData) return;
    
    if (mapRef.current) { // If map already exists, just update source and layers
        return;
    }

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

    map.on('load', async () => {
      map.addSource('malaria-data', {
        type: 'geojson',
        data: geojsonData
      });

      const riskProperty = `rate_${monthIndex}`;

      map.addLayer({
        id: 'malaria-fill',
        type: 'fill',
        source: 'malaria-data',
        paint: {
          'fill-color': [
            'step',
            ['get', riskProperty],
            colorStops[0][1], // Default color for values less than the first stop
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

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      map.on('mousemove', 'malaria-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        const p = f.properties || {};
        const rate = p[`rate_${monthIndex}`];
        const html = `<div style="font-size:12px; color: #000;"><b>Upazila:</b> ${p.UpazilaNameEng || ''}<br/><b>Risk Rate:</b> ${rate !== undefined ? rate.toExponential(2) : 'No data'}</div>`;
        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', 'malaria-fill', () => {
        popup.remove();
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [geojsonData, colorStops]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !geojsonData) return;

    const riskProperty = `rate_${monthIndex}`;

    map.setPaintProperty('malaria-fill', 'fill-color', [
        'step',
        ['get', riskProperty],
        colorStops[0][1],
        ...colorStops.slice(1).flat()
    ]);
    
    // Update tooltip content on month change
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
    map.off('mousemove', 'malaria-fill'); // Remove previous listener to avoid duplicates
    map.on('mousemove', 'malaria-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        const p = f.properties || {};
        const rate = p[riskProperty];
        const html = `<div style="font-size:12px; color: #000;"><b>Upazila:</b> ${p.UpazilaNameEng || ''}<br/><b>Risk Rate:</b> ${rate !== undefined ? rate.toExponential(2) : 'No data'}</div>`;
        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        map.getCanvas().style.cursor = 'pointer';
    });


  }, [monthIndex, geojsonData, colorStops]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Malaria Geospatial Risk Map</CardTitle>
        <CardDescription>
          Monthly simulated malaria risk by upazila. Current month: {monthLabels[monthIndex]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
            <div className="absolute top-2 left-2 z-10">
                <MapLegend title="Malaria Risk Rate" stops={colorStops} labels={legendLabels} />
            </div>
            <div ref={containerRef} style={{ height: '550px' }} className="rounded-lg overflow-hidden shadow" />
            <div className="grid gap-2 pt-4">
                <Label htmlFor="month-slider">Month Selector</Label>
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
