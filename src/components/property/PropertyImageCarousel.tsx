
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import ImageGallery from './ImageGallery';

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
}

const PropertyImageCarousel = ({ images, title }: PropertyImageCarouselProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openGallery(index);
  };

  return (
    <div className="mb-8">
      <div 
        className="w-full relative" 
        ref={emblaRef}
      >
        <div className="flex">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_75%] lg:flex-[0_0_60%] min-w-0 pl-4 first:pl-0">
                <div 
                  className="aspect-video relative rounded-lg overflow-hidden cursor-pointer" 
                  onClick={(e) => handleImageClick(index, e)}
                >
                  <img 
                    src={image} 
                    alt={`${title} - Image ${index + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex-[0_0_100%] min-w-0">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Carousel Controls */}
      {images && images.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  selectedIndex === index ? "bg-costa-600 w-4" : "bg-gray-300"
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              className={cn(
                "h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors",
                !canScrollPrev && "opacity-50 cursor-not-allowed"
              )}
              disabled={!canScrollPrev}
              onClick={() => emblaApi?.scrollPrev()}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>
            <button 
              className={cn(
                "h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors",
                !canScrollNext && "opacity-50 cursor-not-allowed"
              )}
              disabled={!canScrollNext}
              onClick={() => emblaApi?.scrollNext()}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Image Gallery Modal */}
      <ImageGallery
        images={images} 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};

export default PropertyImageCarousel;
