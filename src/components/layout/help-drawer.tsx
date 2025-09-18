'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function HelpDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help / Setup">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[520px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>Setup & Matrox Migration</SheetTitle>
        </SheetHeader>

        {/* Render side-panel tabs/markdown here */}
      </SheetContent>
    </Sheet>
  );
}
