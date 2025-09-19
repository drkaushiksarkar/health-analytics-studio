"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Biohazard, Map } from 'lucide-react';
import { LocationFilter } from '../filters/location-filter';
import { DiseaseFilter } from '../filters/disease-filter';
import { DateRangeFilter } from '../filters/date-range-filter';
import { ReportDownloader } from '../dashboard/report-downloader';
import Link from 'next/link';

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
         <SidebarGroup>
            <SidebarGroupLabel>Views</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Dashboard">Dashboard</SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/maps/districts" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="District Map">
                            <Map />
                            <span>Districts Map</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ReportDownloader />
      </SidebarFooter>
    </>
  );
}
