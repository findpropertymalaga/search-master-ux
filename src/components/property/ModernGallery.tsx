
import { useState, useRef, useEffect } from 'react';
import { Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernGalleryProps {
  images: string[];
  title: string;
  className?: string;
  aspectRatio?: string;
  showFullscreenButton?: boolean;
  onSwipe?: () => void;
  variant?: 'card' | 'detailed';
}

const ModernGallery = ({ 
  images = [], 
  title,
  className,
  aspectRatio = "aspect-[3/4]",
  showFullscreenButton = true,
  onSwipe,
  variant = 'card'
}: ModernGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Handle image navigation
  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex(prev => (prev + 1) % images.length);
      onSwipe?.();
    }
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      onSwipe?.();
    }
  };
  
  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
    onSwipe?.();
  };
  
  // Fullscreen handling
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!isFullscreen) {
      galleryRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(true)); // Fallback for browsers that don't support requestFullscreen
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(() => setIsFullscreen(false));
      } else {
        setIsFullscreen(false);
      }
    }
  };
  
  // Touch and mouse drag handling
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPosition({ x: clientX, y: clientY });
    setCurrentPosition({ x: clientX, y: clientY });
    setDragOffset(0);
  };
  
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    setCurrentPosition({ x: clientX, y: clientY });
    const deltaX = clientX - startPosition.x;
    setDragOffset(deltaX);
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const deltaX = currentPosition.x - startPosition.x;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold && images.length > 1) {
      if (deltaX > 0) {
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
    handleDragStart(touch.clientX, touch.clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleDragEnd();
  };
  
  // Mouse events (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDragEnd();
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragOffset(0);
  };
  
  // Keyboard navigation
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
  
  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Mobile fullscreen scroll handling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile || !isFullscreen) return;
    
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };
  
  // Default placeholder
  if (images.length === 0) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", aspectRatio, className)}>
        <img 
          src="/placeholder.svg" 
          alt={title}
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }
  
  // Mobile fullscreen view (vertical scrolling)
  if (isMobile && isFullscreen) {
    return (
      <div 
        ref={galleryRef}
        className="fixed inset-0 z-[9999] bg-black"
      >
        {/* Close button */}
        <div className="absolute top-6 right-6 z-20">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-black/60 hover:bg-black/80 border-none text-white rounded-full backdrop-blur-sm"
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
            scrollBehavior: 'smooth',
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
        {images.length > 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    );
  }
  
  // Standard gallery view
  return (
    <div 
      className={cn("relative group overflow-hidden rounded-xl", className)}
      ref={galleryRef}
    >
      <div 
        className={cn(
          "relative select-none",
          isFullscreen ? "fixed inset-0 z-[9999] bg-black flex items-center justify-center" : aspectRatio
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Fullscreen button */}
        {showFullscreenButton && (
          <div className={cn(
            "absolute top-4 right-4 z-20",
            !isFullscreen && variant === 'card' && "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isFullscreen && "opacity-100"
          )}>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/60 hover:bg-black/80 border-none text-white rounded-full backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        )}
        
        {/* Image container with smooth transitions */}
        <div 
          className={cn(
            "relative w-full h-full overflow-hidden",
            isFullscreen ? "flex items-center justify-center" : ""
          )}
          ref={containerRef}
        >
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
                  className={cn(
                    "w-full h-full",
                    isFullscreen ? "object-contain" : "object-cover"
                  )}
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation arrows for desktop */}
        {images.length > 1 && !isMobile && (
          <>
            <button 
              className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full",
                "bg-black/60 hover:bg-black/80 text-white flex items-center justify-center",
                "transition-all duration-200 backdrop-blur-sm",
                variant === 'card' && !isFullscreen && "opacity-0 group-hover:opacity-100"
              )}
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              className={cn(
                "absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full",
                "bg-black/60 hover:bg-black/80 text-white flex items-center justify-center",
                "transition-all duration-200 backdrop-blur-sm",
                variant === 'card' && !isFullscreen && "opacity-0 group-hover:opacity-100"
              )}
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentIndex 
                    ? "bg-white w-6" 
                    : "bg-white/60 hover:bg-white/80"
                )}
                onClick={(e) => goToImage(index, e)}
              />
            ))}
          </div>
        )}
        
        {/* Desktop fullscreen counter */}
        {isFullscreen && images.length > 1 && !isMobile && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernGallery;
