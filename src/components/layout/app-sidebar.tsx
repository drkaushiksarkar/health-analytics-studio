"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Biohazard } from 'lucide-react';
import { LocationFilter } from '../filters/location-filter';
import { DiseaseFilter } from '../filters/disease-filter';
import { DateRangeFilter } from '../filters/date-range-filter';
import { ReportDownloader } from '../dashboard/report-downloader';

export default function AppSidebar() {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Biohazard className="size-8 text-primary" />
          <span className="font-headline text-2xl font-semibold">
            DiseaseVision
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <div className="space-y-4">
            <LocationFilter />
            <DiseaseFilter />
            <DateRangeFilter />
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ReportDownloader />
      </SidebarFooter>
    </>
  );
}
