'use client';

import * as React from 'react';
import { HelpCircle, FileText, BarChart2, Map, Users, Settings, Database, Filter, Download, MousePointerClick, AreaChart, MapPin } from 'lucide-react';
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
                  Welcome to DiseaseVision. This guide provides a step-by-step walkthrough of the dashboard's features to help you monitor disease dynamics effectively.
                </p>

                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <Filter className="mr-2" />
                      Step 1: Using Dashboard Filters
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The sidebar on the left contains filters that allow you to customize the data displayed on the dashboard. All charts and maps will dynamically update based on your selections.
                      </p>
                      <ol className="list-decimal pl-5">
                        <li>
                          <strong>Select a Location:</strong>
                          <ul className="list-disc pl-5">
                              <li><strong>Division:</strong> Start by choosing a top-level administrative area (e.g., "Dhaka"). This is the primary location filter.</li>
                              <li><strong>District:</strong> After selecting a division, you can optionally refine your view by choosing a specific district within it (e.g., "Dhaka North"). If no district is selected, the data will be aggregated for the entire division.</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Select a Disease:</strong>
                           <ul className="list-disc pl-5">
                              <li>Choose from the available diseases in the dropdown (e.g., "Dengue," "Influenza"). The entire dashboard will update to show data relevant to the selected disease.</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Select a Date Range:</strong>
                          <ul className="list-disc pl-5">
                              <li>Click the date field to open a calendar.</li>
                              <li>Select a start date and an end date to define the time period for the "Disease Case Trends" chart. You can navigate between months using the arrows.</li>
                          </ul>
                        </li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <BarChart2 className="mr-2" />
                      Step 2: Interpreting the Visualizations
                    </AccordionTrigger>
                    <AccordionContent>
                       <p>The main grid consists of several interactive cards. Here’s how to read them:</p>
                        <ol className="list-decimal pl-5">
                            <li><strong>Weather Panels:</strong> At the top, these show current key weather indicators like Temperature, Humidity, and Rainfall. If a value is red, it indicates an extreme weather condition that could elevate disease risk.</li>
                            <li>
                                <strong><AreaChart className="inline-block h-4 w-4 mr-1" />Disease Case Trends:</strong>
                                <ul className="list-disc pl-5">
                                    <li><strong>Actual Cases (Purple Area):</strong> This shows the number of reported cases.</li>
                                    <li><strong>Predicted Cases (Orange Line):</strong> This is the model's forecast for case counts.</li>
                                    <li><strong>Prediction Uncertainty (Light Orange Shaded Area):</strong> This band represents the confidence interval of our prediction. A wider band means more uncertainty.</li>
                                    <li><strong>Zoom & Pan:</strong> Use the brush tool at the bottom of the chart to click and drag to zoom into a specific time period.</li>
                                </ul>
                            </li>
                            <li>
                                <strong><MousePointerClick className="inline-block h-4 w-4 mr-1" />Feature Importance:</strong>
                                <ul className="list-disc pl-5">
                                    <li>This chart shows which factors are most influential in the model's predictions.</li>
                                    <li><strong>Positive Bars (Purple):</strong> Factors that increase the predicted number of cases (e.g., `Rainfall (14d lag)`).</li>
                                    <li><strong>Negative Bars (Orange):</strong> Factors that decrease the predicted number of cases (e.g., `Govt. Interventions`).</li>
                                </ul>
                            </li>
                            <li>
                                <strong><Map className="inline-block h-4 w-4 mr-1" />Disease Incidence Map:</strong>
                                <ul className="list-disc pl-5">
                                    <li>This map of Genland shows disease incidence by district.</li>
                                    <li><strong>Hover:</strong> Move your mouse over a district to see its name.</li>
                                    <li><strong>Click:</strong> Click a district to select it and see its exact incidence rate displayed in the card's description. The selected district will be highlighted with a border.</li>
                                    <li><strong>Color Legend:</strong> Red = High Incidence, Orange = Medium Incidence, Purple = Low Incidence.</li>
                                </ul>
                            </li>
                             <li>
                                <strong><MapPin className="inline-block h-4 w-4 mr-1" />Non-Spatial Risk Heatmap:</strong>
                                <ul className="list-disc pl-5">
                                    <li>This table ranks specific, named locations (not tied to the map) by their risk score.</li>
                                     <li><strong>Sorting:</strong> Click on the headers ("Risk Level," "Score," "Change") to sort the table and identify the highest-risk areas or those with the most significant recent change.</li>
                                </ul>
                            </li>
                        </ol>
                    </AccordionContent>
                  </AccordionItem>
                    <AccordionItem value="item-3">
                    <AccordionTrigger>
                      <Download className="mr-2" />
                      Step 3: Generating a Report
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        You can download a summary report based on your current filter settings.
                      </p>
                      <ol className="list-decimal pl-5">
                          <li>First, set your desired <strong>Location</strong>, <strong>Disease</strong>, and <strong>Date Range</strong> filters as described in Step 1.</li>
                          <li>Click the <strong>"Download Report"</strong> button at the bottom of the sidebar.</li>
                          <li>Our GenAI assistant will generate a report in CSV or PDF format based on your selections. A "Save As" dialog will appear in your browser, allowing you to download the file.</li>
                          <li>Note: The report generation is powered by AI and may take a few moments.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="migration" className="p-1">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  This guide outlines the baby steps for migrating your team and data from the legacy Matrox system to the new, real-time DiseaseVision platform.
                </p>

                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <Database className="mr-2" />
                      Phase 1: Data Mapping & Integration
                    </AccordionTrigger>
                    <AccordionContent>
                        <h5>Step 1.1: Map Location Hierarchy</h5>
                        <p>The first step is to ensure your old location data maps to the new system's structure. DiseaseVision uses a clear parent-child hierarchy.</p>
                         <ol className="list-decimal pl-5">
                            <li>Export your location list from Matrox.</li>
                            <li>In your export script, create two columns: `new_id` and `parent_id`.</li>
                            <li>Map Matrox `Region` to DiseaseVision `Division`. For example, Matrox's "Dhaka Region" becomes the `genland-dhaka` division.</li>
                            <li>Map Matrox `Area` to DiseaseVision `District`. For example, Matrox's "North Dhaka" area becomes the `dhaka-north` district, and you must set its `parent_id` to `genland-dhaka`.</li>
                            <li>Update `src/lib/data.ts` with your new locations.</li>
                        </ol>

                         <h5>Step 1.2: Map Predictive Features</h5>
                         <p>The predictive model in DiseaseVision uses new, time-lagged features. You must transform your historical data from Matrox to match this format for accurate back-testing.</p>
                         <ol className="list-decimal pl-5">
                             <li><strong>Rainfall:</strong> For a case reported on a given day, the model needs rainfall data from 14 days prior. Your ETL script must join `case_history` with `weather_logs` on `date - 14 days`. Matrox `precip_mm` maps to `Rainfall (14d lag)`.</li>
                             <li><strong>Temperature:</strong> Similarly, map Matrox `temp_c` to `Temperature (7d lag)`.</li>
                             <li><strong>Case History:</strong> Map Matrox `case_history` to `Previous Cases (7d)`.</li>
                         </ol>
                         <p>The `Feature Importance` chart on the dashboard will help you verify that these new features are influencing predictions as expected.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <Users className="mr-2" />
                      Phase 2: User Training & Onboarding
                    </AccordionTrigger>
                    <AccordionContent>
                      <h5>Step 2.1: Introduce the New UI</h5>
                      <ol className="list-decimal pl-5">
                          <li>Hold a training session and walk users through the "Setup Guide" tab of this help panel.</li>
                          <li>Emphasize the interactivity: demonstrate how changing a filter in the sidebar instantly updates all charts. This is a major improvement over Matrox's static reports.</li>
                          <li>Show them how to use the `Disease Case Trends` brush tool to investigate specific time ranges, a feature unavailable in Matrox.</li>
                      </ol>

                      <h5>Step 2.2: Explain the AI-Powered Features</h5>
                      <ol className="list-decimal pl-5">
                          <li><strong>Feature Importance:</strong> Explain that this chart provides unprecedented transparency into "why" the model is making a certain prediction, helping to build trust in the system.</li>
                          <li><strong>AI Report Downloader:</strong> Introduce the "Download Report" button. Clarify that it uses Generative AI to create a summary on-demand based on their filters, replacing the old, manually-prepared Matrox reports.</li>
                      </ol>
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
