
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, LngLatBoundsLike } from 'maplibre-gl';
import * as turf from '@turf/turf';

type Props = {
  height?: string;
  showLabelsDefault?: boolean;
  predictionData?: { [districtName: string]: number };
};

const MapLegend = ({ title, stops }: { title: string, stops: [number, string][] }) => (
  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
    <h3 className="font-semibold text-sm mb-2">{title}</h3>
    <div className="flex flex-col gap-1">
      {stops.map(([value, color], i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ backgroundColor: color }} className="w-4 h-4 rounded-sm border border-black/20" />
          <span className="text-xs">
            {i === 0 ? `< ${stops[i+1][0]}` : i === stops.length - 1 ? `> ${value}` : `${value} - ${stops[i+1][0]}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function DiarrhoeaMap({
  height = '550px',
  showLabelsDefault = true,
  predictionData = {}
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const legendContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const colorStops: [number, string][] = [
    [0, '#f7fcfd'],
    [5, '#e0ecf4'],
    [10, '#bfd3e6'],
    [20, '#9ebcda'],
    [40, '#8c96c6'],
    [60, '#8c6bb1'],
    [80, '#88419d'],
    [100, '#6e016b']
  ];

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
    if (!containerRef.current || mapRef.current) return;

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
      center: [90.4, 23.7],
      zoom: 5.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

    map.on('load', async () => {
      const res = await fetch('/geo/districts.geojson');
      const gj = await res.json();

      gj.features.forEach((feature: any) => {
        const districtName = feature.properties.ADM2_EN;
        const predictedCases = predictionData[districtName];
        feature.properties.predictedCases = predictedCases;
        feature.properties.fillColor = getFillColor(predictedCases);
      });

      map.addSource('districts', {
        type: 'geojson',
        data: gj,
        promoteId: 'ADM2_EN'
      });

      map.addLayer({
        id: 'district-fill',
        type: 'fill',
        source: 'districts',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': 0.7,
          'fill-outline-color': '#000000',
        }
      });
      map.addLayer({
        id: 'district-outline',
        type: 'line',
        source: 'districts',
        paint: { 'line-width': 1, 'line-color': '#333' }
      });

      const bbox = turf.bbox(gj) as LngLatBoundsLike;
      map.fitBounds(bbox, { padding: 24 });
      
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      map.on('mousemove', 'district-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        const p = f.properties || {};
        const cases = p.predictedCases !== undefined ? p.predictedCases.toLocaleString() : 'No data';
        const html = `<div style="font-size:12px; color: #000;"><b>District:</b> ${p.ADM2_EN || ''}<br/><b>Predicted Cases:</b> ${cases}</div>`;
        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'district-fill', () => {
        popup.remove();
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;
    return () => mapRef.current?.remove();
  }, [predictionData, showLabelsDefault]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} style={{ height }} className="rounded-lg overflow-hidden shadow" />
      <div ref={legendContainerRef} className="absolute bottom-2 left-2 z-10">
          <MapLegend title="Total Predicted Cases" stops={colorStops} />
      </div>
    </div>
  );
}

    