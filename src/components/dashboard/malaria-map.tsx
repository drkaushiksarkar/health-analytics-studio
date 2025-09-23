"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl, { Map, LngLatBoundsLike } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import Papa from 'papaparse';

const MapLegend = ({ title, stops }: { title: string, stops: [number, string][] }) => (
  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
    <h3 className="font-semibold text-sm mb-2">{title}</h3>
    <div className="flex flex-col gap-1">
      {stops.map(([value, color], i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ backgroundColor: color }} className="w-4 h-4 rounded-sm border border-black/20" />
          <span className="text-xs">
             {i === 0 ? `< ${stops[1][0].toFixed(1)}` : i === stops.length - 1 ? `≥ ${value.toFixed(1)}` : `${value.toFixed(1)} - ${stops[i + 1][0].toFixed(1)}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function MalariaMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [monthIndex, setMonthIndex] = useState(0); // 0-11 for Jan-Dec
  const [geojsonData, setGeojsonData] = useState<any>(null);

  const colorStops: [number, string][] = useMemo(() => [
    [0.0, '#feebe2'],
    [0.1, '#fcc5c0'],
    [0.2, '#fa9fb5'],
    [0.4, '#f768a1'],
    [0.6, '#dd3497'],
    [0.8, '#ae017e'],
    [1.0, '#7a0177'],
  ], []);

  const monthLabels = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];

 useEffect(() => {
    async function loadData() {
      const [geojsonRes, csvRes] = await Promise.all([
        fetch('/geo/upazilas.geojson'),
        fetch('/geo/malaria_predictions.csv')
      ]);

      const geojson = await geojsonRes.json();
      const csvText = await csvRes.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const predictionsByUpazila: { [key: string]: any } = {};
          results.data.forEach((row: any) => {
            predictionsByUpazila[row.UpazilaID] = row;
          });

          geojson.features.forEach((feature: any) => {
            const upazilaId = feature.properties.UpazilaID;
            const predictions = predictionsByUpazila[upazilaId];
            if (predictions) {
              monthLabels.forEach((month, index) => {
                feature.properties[`rate_${index}`] = predictions[month];
              });
            }
          });
          setGeojsonData(geojson);
        }
      });
    }

    loadData();
  }, [monthLabels]);

  useEffect(() => {
    if (!containerRef.current || !geojsonData) return;
    if (mapRef.current) mapRef.current.remove();

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

      map.addLayer({
        id: 'malaria-fill',
        type: 'fill',
        source: 'malaria-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-outline-color': '#333',
        }
      });
      map.addLayer({
        id: 'malaria-outline',
        type: 'line',
        source: 'malaria-data',
        paint: { 'line-width': 1, 'line-color': '#333' }
      });
      
      const bbox = turf.bbox(geojsonData) as LngLatBoundsLike;
      map.fitBounds(bbox, { padding: 24 });

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      map.on('mousemove', 'malaria-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        const p = f.properties || {};
        const rate = p[`rate_${monthIndex}`];
        const html = `<div style="font-size:12px; color: #000;"><b>Upazila:</b> ${p.UpazilaNameEng || ''}<br/><b>Risk Rate:</b> ${rate !== undefined ? rate.toFixed(2) : 'No data'}</div>`;
        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'malaria-fill', () => {
        popup.remove();
        map.getCanvas().style.cursor = '';
      });
    });

    return () => mapRef.current?.remove();
  }, [geojsonData]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !geojsonData) return;

    const riskProperty = `rate_${monthIndex}`;

    map.setPaintProperty('malaria-fill', 'fill-color', [
        'step',
        ['get', riskProperty],
        '#CCCCCC', // Default for no data or values below the first stop
        ...colorStops.flat()
    ]);

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
                <MapLegend title="Malaria Risk Rate" stops={colorStops} />
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
