
import { useRef, useState, useEffect } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VerticalGalleryProps {
  images: string[];
  title: string;
}

const VerticalGallery = ({ images, title }: VerticalGalleryProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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
  
  // Scroll detection to update active image index
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    // Determine which image is most visible
    const imageIndex = Math.round(scrollTop / containerHeight);
    if (imageIndex >= 0 && imageIndex < images.length && imageIndex !== activeIndex) {
      setActiveIndex(imageIndex);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          setActiveIndex(prev => Math.max(0, prev - 1));
          imageRefs.current[Math.max(0, activeIndex - 1)]?.scrollIntoView({ behavior: 'smooth' });
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          setActiveIndex(prev => Math.min(images.length - 1, prev + 1));
          imageRefs.current[Math.min(images.length - 1, activeIndex + 1)]?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, images.length, isFullscreen]);

  return (
    <div className="relative mb-8">
      <div 
        ref={galleryRef} 
        className={cn(
          "relative overflow-hidden rounded-lg",
          isFullscreen ? "fixed inset-0 z-50 bg-black" : "aspect-video"
        )}
      >
        {/* Fullscreen controls */}
        {images.length > 0 && (
          <div className={cn(
            "absolute top-4 right-4 z-10 flex gap-2",
            !isFullscreen && "opacity-0 group-hover:opacity-100 transition-opacity"
          )}>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/50 hover:bg-black/70 border-none text-white rounded-full"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        )}
        
        {/* Vertical scrolling container */}
        <div 
          className={cn(
            "h-full overflow-y-auto snap-y snap-mandatory",
            isFullscreen ? "overscroll-contain" : ""
          )}
          onScroll={handleScroll}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={index}
                ref={el => imageRefs.current[index] = el}
                className={cn(
                  "snap-start h-full w-full flex items-center justify-center",
                  isFullscreen ? "snap-always" : ""
                )}
                style={{ height: '100vh' }}
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
            <div className="flex items-center justify-center h-full">
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
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalGallery;
