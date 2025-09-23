
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PropertyMap } from '.';
import { Property } from '@/components/property/types';

interface PropertyMapModalProps {
  properties: Property[];
}

export const PropertyMapModal = ({ properties }: PropertyMapModalProps) => {
  const [open, setOpen] = useState(false);

  // Find the imageUrl property and modify it to handle string or string array
  const processedProperties = properties.map(property => ({
    ...property,
    imageUrl: Array.isArray(property.imageUrl) ? property.imageUrl[0] : property.imageUrl
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-secondary-foreground h-10 px-4 py-2">
          Visa på karta
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Property Locations</DialogTitle>
        </DialogHeader>
        <PropertyMap properties={processedProperties} isFullscreen={false} />
      </DialogContent>
    </Dialog>
  );
};
