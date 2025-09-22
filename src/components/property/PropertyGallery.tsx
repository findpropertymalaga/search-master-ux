
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  aspectRatio?: number;
  className?: string;
  onSwipe?: () => void;
  showFullscreenButton?: boolean;
  isCard?: boolean;
}

const PropertyGallery = ({ 
  images = [], 
  title, 
  aspectRatio = 3/4, // 3:4 aspect ratio (more vertical)
  className,
  onSwipe,
  showFullscreenButton = false,
  isCard = false
}: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  console.log('PropertyGallery render:', { isMobile, isFullscreen, imagesCount: images.length });
  
  // Navigation functions
  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
    onSwipe?.();
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    onSwipe?.();
  };
  
  // Enhanced fullscreen handling for mobile
  const toggleFullscreen = () => {
    console.log('toggleFullscreen called:', { isMobile, currentState: isFullscreen });
    
    if (isMobile) {
      // For mobile, use our custom fullscreen state
      setIsFullscreen(!isFullscreen);
    } else {
      // For desktop, use browser fullscreen API
      if (!document.fullscreenElement) {
        galleryRef.current?.requestFullscreen()
          .catch(err => console.error(`Error enabling fullscreen: ${err.message}`));
        setIsFullscreen(true);
      } else {
        document.exitFullscreen()
          .catch(err => console.error(`Error exiting fullscreen: ${err.message}`));
        setIsFullscreen(false);
      }
    }
  };
  
  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 50;
    
    if (isSignificantSwipe && images.length > 1) {
      if (distance > 0) {
        nextImage();
      } else {
        prevImage();
      }
      e.stopPropagation();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Mouse handling for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isMobile) return;
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || isMobile) return;
    
    const distance = startX - e.clientX;
    const isSignificantSwipe = Math.abs(distance) > 50;
    
    if (isSignificantSwipe && images.length > 1) {
      if (distance > 0) {
        nextImage();
      } else {
        prevImage();
      }
      e.stopPropagation();
    }
    
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') {
          if (isMobile) {
            setIsFullscreen(false);
          } else {
            setIsFullscreen(false);
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length, isMobile]);
  
  // Fullscreen change detection (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, [isMobile]);

  // Mobile fullscreen scroll handling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile || !isFullscreen) return;
    
    const container = e.currentTarget;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    const imageIndex = Math.round(scrollTop / containerHeight);
    if (imageIndex >= 0 && imageIndex < images.length && imageIndex !== currentIndex) {
      setCurrentIndex(imageIndex);
    }
  };
  
  // Show placeholder if no images
  if (images.length === 0) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <AspectRatio ratio={aspectRatio}>
          <img 
            src="/placeholder.svg" 
            alt={title}
            className="w-full h-full object-cover" 
          />
        </AspectRatio>
      </div>
    );
  }
  
  // Mobile fullscreen view (vertical scrolling) - Fixed condition
  if (isMobile && isFullscreen) {
    console.log('Rendering mobile fullscreen view');
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
          onScroll={handleScroll}
          style={{
            height: '100vh',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {images.map((image, index) => (
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
          ))}
        </div>
        
        {/* Image counter */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Next image indicator for mobile - Enhanced visibility */}
        {currentIndex < images.length - 1 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <ChevronDown className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Standard gallery view (non-fullscreen mobile and all desktop views)
  return (
    <div 
      className={cn("relative group overflow-hidden rounded-lg", className)}
      ref={galleryRef}
    >
      <div 
        className={cn(
          "relative",
          isFullscreen && !isMobile ? "fixed inset-0 z-[9999] bg-black flex items-center justify-center" : ""
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fullscreen button */}
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
        
        {/* Image container */}
        <div className={cn(isFullscreen && !isMobile ? "w-full h-full" : "w-full")}>
          {!isFullscreen || isMobile ? (
            <AspectRatio ratio={aspectRatio}>
              <img
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          ) : (
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button 
              className={cn(
                "absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full",
                "bg-white/80 hover:bg-white shadow-sm border-0 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full",
                "bg-white/80 hover:bg-white shadow-sm border-0 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  index === currentIndex ? "bg-white w-3" : "bg-white/50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  onSwipe?.();
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Image counter for fullscreen desktop */}
        {isFullscreen && images.length > 1 && !isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGallery;
