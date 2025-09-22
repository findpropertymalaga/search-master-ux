
import { useState, useRef, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi
} from '@/components/ui/carousel';

interface ResponsiveGalleryProps {
  images: string[];
  title: string;
  className?: string;
  showFullscreenButton?: boolean;
  aspectRatio?: string;
}

const ResponsiveGallery = ({ 
  images, 
  title, 
  className,
  showFullscreenButton = true,
  aspectRatio = "aspect-[3/4]"
}: ResponsiveGalleryProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      galleryRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
      setIsFullscreen(false);
    }
  };
  
  // Update fullscreen state when exiting via Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          if (api) {
            api.scrollPrev();
          }
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          if (api) {
            api.scrollNext();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, api]);

  // Update active index when carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Mobile fullscreen view (vertical scrolling)
  if (isMobile && isFullscreen) {
    return (
      <div 
        ref={galleryRef}
        className="fixed inset-0 z-[9999] bg-black"
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-black/50 hover:bg-black/70 border-none text-white rounded-full"
            onClick={toggleFullscreen}
          >
            <Minimize className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Vertical scrolling container */}
        <div 
          className="h-full overflow-y-auto snap-y snap-mandatory overscroll-contain"
          onScroll={(e) => {
            const container = e.currentTarget;
            const containerHeight = container.clientHeight;
            const scrollTop = container.scrollTop;
            
            const imageIndex = Math.round(scrollTop / containerHeight);
            if (imageIndex >= 0 && imageIndex < images.length && imageIndex !== activeIndex) {
              setActiveIndex(imageIndex);
            }
          }}
          style={{
            height: '100vh',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={index}
                className="snap-start h-screen w-full flex items-center justify-center p-4"
              >
                <img
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))
          ) : (
            <div className="snap-start h-screen w-full flex items-center justify-center p-4">
              <img 
                src="/placeholder.svg" 
                alt={title}
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          )}
        </div>
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    );
  }
  
  // Standard view (non-fullscreen mobile and all desktop views)
  return (
    <div className={cn("relative group", className)} ref={galleryRef}>
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        isFullscreen ? "fixed inset-0 z-50 bg-black" : aspectRatio
      )}>
        {/* Fullscreen controls */}
        {showFullscreenButton && (
          <div className={cn(
            "absolute top-4 right-4 z-10",
            !isFullscreen && "opacity-0 group-hover:opacity-100 transition-opacity"
          )}>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/50 hover:bg-black/70 border-none text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        )}
        
        <Carousel
          opts={{ loop: true }}
          setApi={setApi}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {images.length > 0 ? (
              images.map((image, index) => (
                <CarouselItem key={index} className="h-full flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover",
                      isFullscreen && "object-contain"
                    )}
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="h-full flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt={title}
                  className="w-full h-full object-cover" 
                />
              </CarouselItem>
            )}
          </CarouselContent>
          
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-0 right-0">
                <CarouselDots count={images.length} />
              </div>
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default ResponsiveGallery;
