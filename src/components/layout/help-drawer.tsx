'use client';

import * as React from 'react';
import { HelpCircle, FileText, BarChart2, Map, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '../ui/scroll-area';

export default function HelpDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help / Setup">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[520px] sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Setup & Matrox Migration</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              <TabsTrigger value="migration">Matrox Migration</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-10rem)]">
            <TabsContent value="setup" className="p-1">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  Welcome to DiseaseVision, an advanced dashboard for real-time
                  disease dynamics monitoring. This guide will walk you through
                  the key features and functionalities.
                </p>

                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <FileText className="mr-2" />
                      Dashboard Filters
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The sidebar filters allow you to dynamically update the
                        dashboard visualizations:
                      </p>
                      <ul>
                        <li>
                          <strong>Location:</strong> Select a division and an
                          optional district to focus on a specific geographical
                          area.
                        </li>
                        <li>
                          <strong>Disease:</strong> Choose from available
                          diseases like Dengue, Influenza, or Malaria to see
                          relevant data.
                        </li>
                        <li>
                          <strong>Date Range:</strong> Refine the time-series
                          data by selecting a specific date range.
                        </li>
                      </ul>
                      <p>
                        The "Download Report" button uses your current filter
                        selections to generate a report via GenAI.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <BarChart2 className="mr-2" />
                      Key Visualizations
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The main grid consists of several interactive cards:
                      </p>
                      <ul>
                        <li>
                          <strong>Disease Case Trends:</strong> An area chart
                          showing actual vs. predicted cases over time,
                          including an uncertainty range. You can use the brush
                          below the chart to zoom in on a specific period.
                        </li>
                        <li>
                          <strong>Feature Importance:</strong> A bar chart that
                          ranks the key drivers for the model's predictions,
                          such as rainfall and temperature.
                        </li>
                        <li>
                          <strong>Disease Incidence Map:</strong> A choropleth
                          map visualizing disease incidence across different
                          districts of Genland. Hover or click on a district for
                          more details.
                        </li>
                        <li>
                          <strong>Non-Spatial Risk Heatmap:</strong> A table
                          displaying risk scores and trends for specific
                          high-risk locations, sortable by risk level, score, or
                          change.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="migration" className="p-1">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  Migrating from the legacy Matrox system to DiseaseVision
                  unlocks real-time analytics and predictive modeling.
                  This checklist outlines the key steps.
                </p>

                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <Users className="mr-2" />
                      User &amp; Location Data
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The new system uses a hierarchical location model.
                        Ensure your Matrox location data is mapped correctly.
                      </p>
                      <ul>
                        <li>
                          Matrox `Region` {'->'} DiseaseVision `Division`
                        </li>
                        <li>
                          Matrox `Area` {'->'} DiseaseVision `District`
                        </li>
                      </ul>
                      <p>
                        User accounts are now managed via Firebase Authentication,
                        offering more robust security.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <Settings className="mr-2" />
                      Model &amp; Feature Mapping
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        DiseaseVision utilizes a new set of predictive features.
                        Map your legacy data points to the new features:
                      </p>
                      <ul>
                        <li>
                          Matrox `precip_mm` {'->'} `Rainfall (14d lag)`
                        </li>
                        <li>
                          Matrox `temp_c` {'->'} `Temperature (7d lag)`
                        </li>
                        <li>
                          Matrox `case_history` {'->'}{' '}
                          `Previous Cases (7d)`
                        </li>
                      </ul>
                      <p>
                        The new `Feature Importance` chart provides transparency
                        into how these factors influence predictions, a feature
                        not available in Matrox.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}