
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedGalleryProps {
  images: string[];
  title: string;
  className?: string;
  variant: 'card' | 'detailed';
  showFullscreenButton?: boolean;
  onImageClick?: () => void;
}

const EnhancedGallery = ({ 
  images = [], 
  title,
  className,
  variant,
  showFullscreenButton = true,
  onImageClick
}: EnhancedGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Force re-render key to fix mobile view after fullscreen exit
  const [renderKey, setRenderKey] = useState(0);
  
  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Force re-render when exiting fullscreen on mobile to ensure correct view
  useEffect(() => {
    if (!isFullscreen && isMobile) {
      // Small delay to ensure state has settled
      const timeout = setTimeout(() => {
        setRenderKey(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isFullscreen, isMobile]);
  
  // Navigation functions
  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };
  
  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };
  
  // Fixed fullscreen handling
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (variant === 'detailed') {
      console.log('Toggling fullscreen from', isFullscreen, 'to', !isFullscreen, 'isMobile:', isMobile);
      setIsFullscreen(!isFullscreen);
      
      // Force a re-render by resetting drag state when exiting fullscreen on mobile
      if (isFullscreen && isMobile) {
        setIsDragging(false);
        setDragOffset(0);
      }
    }
  };
  
  // Handle card click navigation
  const handleCardClick = (e: React.MouseEvent) => {
    if (variant === 'card' && onImageClick && !isDragging) {
      e.stopPropagation();
      onImageClick();
    }
  };
  
  // Touch and drag handling
  const handleDragStart = (clientX: number, e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPosition({ x: clientX, y: 0 });
    setDragOffset(0);
  };
  
  const handleDragMove = (clientX: number, e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    const deltaX = clientX - startPosition.x;
    setDragOffset(deltaX);
  };
  
  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const threshold = 80;
    if (Math.abs(dragOffset) > threshold && images.length > 1) {
      if (dragOffset > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, e);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, e);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    handleDragEnd(e);
  };
  
  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e);
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    handleDragEnd(e);
  };
  
  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'Escape':
            setIsFullscreen(false);
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  // Default placeholder
  if (images.length === 0) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl bg-gray-100",
        variant === 'card' ? "aspect-[4/3] w-full" : "aspect-[4/3] md:aspect-[21/9]",
        className
      )}>
        <img 
          src="/placeholder.svg" 
          alt={title}
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  // Fullscreen mode
  if (isFullscreen && variant === 'detailed') {
    return (
      <div 
        ref={galleryRef}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(false);
        }}
      >
        {/* Close button */}
        <div className="absolute top-6 right-6 z-20">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-black/70 hover:bg-black/90 border-none text-white rounded-full backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation arrows for desktop */}
        {!isMobile && images.length > 1 && (
          <>
            <button 
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        {/* Image container */}
        {isMobile ? (
          // Mobile: Vertical scrolling
          <div 
            className="h-full w-full overflow-y-auto snap-y snap-mandatory"
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollTop = container.scrollTop;
              const itemHeight = container.clientHeight;
              const newIndex = Math.round(scrollTop / itemHeight);
              if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
                setCurrentIndex(newIndex);
              }
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
        ) : (
          // Desktop: Single image with navigation
          <div 
            className="relative w-full h-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="eager"
              draggable={false}
            />
          </div>
        )}
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    );
  }

  // Card variant (small cards)
  if (variant === 'card') {
    return (
      <div 
        className={cn("relative group overflow-hidden rounded-xl w-full cursor-pointer", className)}
        ref={galleryRef}
        onClick={handleCardClick}
      >
        <div 
          className="relative aspect-[4/3] w-full select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* Image container */}
          <div className="relative w-full h-full overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-out h-full"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
                width: `${images.length * 100}%`
              }}
            >
              {images.map((image, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-full h-full"
                  style={{ width: `${100 / images.length}%` }}
                >
                  <img
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-200",
                    index === currentIndex 
                      ? "bg-white w-4" 
                      : "bg-white/60 hover:bg-white/80"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToImage(index, e);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed variant (property details page)
  if (variant === 'detailed') {
    // For detailed view: desktop shows 3 images, mobile shows 1 with 4:3 aspect ratio
    const imagesPerSlide = isMobile ? 1 : 3;
    const maxIndex = images.length - 1;
    
    // Calculate current slide for desktop (groups of 3)
    const currentSlide = isMobile ? currentIndex : Math.floor(currentIndex / imagesPerSlide);
    const totalSlides = Math.ceil(images.length / imagesPerSlide);
    
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;
    
    const handlePrev = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (canGoPrev) {
        if (isMobile) {
          setCurrentIndex(prev => prev - 1);
        } else {
          // Desktop: go to previous group of 3
          const newIndex = Math.max(0, currentIndex - imagesPerSlide);
          setCurrentIndex(newIndex);
        }
      }
    };
    
    const handleNext = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (canGoNext) {
        if (isMobile) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // Desktop: go to next group of 3
          const newIndex = Math.min(maxIndex, currentIndex + imagesPerSlide);
          setCurrentIndex(newIndex);
        }
      }
    };
    
    return (
      <div 
        key={renderKey} // Force re-render to fix mobile view after fullscreen exit
        className={cn("relative group", className)}
        ref={galleryRef}
      >
        <div className={cn(
          "relative overflow-hidden rounded-xl",
          isMobile ? "aspect-[4/3]" : "aspect-[21/9]"
        )}>
          {/* Image container */}
          <div 
            className="relative w-full h-full select-none cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={!isMobile ? handleMouseDown : undefined}
            onMouseMove={!isMobile ? handleMouseMove : undefined}
            onMouseUp={!isMobile ? handleMouseUp : undefined}
            onMouseLeave={() => setIsDragging(false)}
            onClick={toggleFullscreen}
          >
            {isMobile ? (
              // Mobile: Single image display with 4:3 aspect ratio
              <div className="w-full h-full">
                <img
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="eager"
                  draggable={false}
                />
              </div>
            ) : (
              // Desktop: Three images side by side
              <div className="flex gap-2 px-2 h-full">
                {images.slice(currentIndex, currentIndex + 3).map((image, index) => (
                  <div key={currentIndex + index} className="flex-1 h-full">
                    <img
                      src={image}
                      alt={`${title} - Image ${currentIndex + index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>
                ))}
                {/* Fill empty slots if less than 3 images remaining */}
                {images.slice(currentIndex, currentIndex + 3).length < 3 && 
                  Array.from({ length: 3 - images.slice(currentIndex, currentIndex + 3).length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex-1 h-full bg-gray-100 rounded-lg"></div>
                  ))
                }
              </div>
            )}
          </div>
          
          {/* Navigation arrows */}
          {images.length > (isMobile ? 1 : 3) && (
            <>
              <button 
                className={cn(
                  "absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full",
                  "bg-black/70 hover:bg-black/90 text-white flex items-center justify-center",
                  "transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100",
                  !canGoPrev && "opacity-30 cursor-not-allowed"
                )}
                onClick={handlePrev}
                disabled={!canGoPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button 
                className={cn(
                  "absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full",
                  "bg-black/70 hover:bg-black/90 text-white flex items-center justify-center",
                  "transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100",
                  !canGoNext && "opacity-30 cursor-not-allowed"
                )}
                onClick={handleNext}
                disabled={!canGoNext}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {isMobile ? (
                // Mobile: dot for each image
                images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      index === currentIndex
                        ? "bg-white w-6" 
                        : "bg-white/60 hover:bg-white/80"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index, e);
                    }}
                  />
                ))
              ) : (
                // Desktop: dot for each group of 3
                Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <button
                    key={slideIndex}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      slideIndex === currentSlide
                        ? "bg-white w-6" 
                        : "bg-white/60 hover:bg-white/80"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = slideIndex * imagesPerSlide;
                      setCurrentIndex(Math.min(newIndex, maxIndex));
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EnhancedGallery;
