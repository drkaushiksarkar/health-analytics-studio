"use client";

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { locations } from '@/lib/data';
import type { Location } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function LocationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedDivision = searchParams.get('division') || 'genland-dhaka';
  const selectedDistrict = searchParams.get('district');

  const divisions = React.useMemo(() => locations.filter((l) => l.level === 'division'), []);
  const districts = React.useMemo(
    () => locations.filter((l) => l.parent_id === selectedDivision),
    [selectedDivision]
  );

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === 'division') {
      params.delete('district');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <Label>Location</Label>
      <div className="space-y-2">
        <Select
          value={selectedDivision}
          onValueChange={(value) => handleFilterChange('division', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division: Location) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {districts.length > 0 && (
          <Select
            value={selectedDistrict ?? ''}
            onValueChange={(value) => handleFilterChange('district', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district: Location) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
