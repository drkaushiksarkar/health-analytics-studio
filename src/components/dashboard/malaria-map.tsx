"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl, { Map, LngLatBoundsLike } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

const MapLegend = ({ title, stops }: { title: string, stops: [number, string][] }) => (
  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
    <h3 className="font-semibold text-sm mb-2">{title}</h3>
    <div className="flex flex-col gap-1">
      {stops.map(([value, color], i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ backgroundColor: color }} className="w-4 h-4 rounded-sm border border-black/20" />
          <span className="text-xs">
            {i === 0 ? `< ${stops[1][0]}` : i === stops.length - 1 ? `> ${value}` : `${value} - ${stops[i + 1][0]}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function MalariaMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [week, setWeek] = useState(1);
  const [geojsonData, setGeojsonData] = useState<any>(null);

  const colorStops: [number, string][] = useMemo(() => [
    [0, '#feebe2'],
    [0.1, '#fcc5c0'],
    [0.2, '#fa9fb5'],
    [0.4, '#f768a1'],
    [0.6, '#dd3497'],
    [0.8, '#ae017e'],
    [1.0, '#7a0177'],
  ], []);

  const getFillColor = (value: number | undefined): string => {
    if (value === undefined) return '#CCCCCC'; // Default color for no data
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (value >= colorStops[i][0]) {
        return colorStops[i][1];
      }
    }
    return colorStops[0][1];
  };

  useEffect(() => {
    fetch('/geo/malaria.geojson')
      .then(res => res.json())
      .then(data => {
        setGeojsonData(data);
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !geojsonData) return;

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
          'fill-outline-color': '#000000',
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
    });

    mapRef.current = map;

    return () => mapRef.current?.remove();
  }, [geojsonData]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !geojsonData) return;

    const riskProperty = `week_${week}`;

    geojsonData.features.forEach((feature: any) => {
        feature.properties.currentRisk = feature.properties[riskProperty];
    });

    map.setPaintProperty('malaria-fill', 'fill-color', [
        'step',
        ['get', riskProperty],
        '#CCCCCC', // Default for no data
        ...colorStops.flat()
      ]
    );

    // Update the GeoJSON source to trigger a re-render with new properties if necessary
    const source = map.getSource('malaria-data') as maplibregl.GeoJSONSource;
    if(source) {
        source.setData(geojsonData);
    }

  }, [week, geojsonData, colorStops]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Malaria Geospatial Risk Map</CardTitle>
        <CardDescription>
          Weekly simulated malaria risk by upazila. Current week: {week}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
            <div className="absolute top-2 left-2 z-10">
                <MapLegend title="Malaria Risk" stops={colorStops} />
            </div>
            <div ref={containerRef} style={{ height: '550px' }} className="rounded-lg overflow-hidden shadow" />
            <div className="grid gap-2 pt-4">
                <Label htmlFor="week-slider">Week Selector</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        id="week-slider"
                        min={1}
                        max={52}
                        step={1}
                        value={[week]}
                        onValueChange={(value) => setWeek(value[0])}
                    />
                    <span className="text-sm font-medium w-10 text-center">{week}</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}