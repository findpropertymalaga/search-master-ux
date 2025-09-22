
import * as React from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerticalImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const VerticalImageGallery = ({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: VerticalImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const imageRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Toggle fullscreen mode
  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      if (galleryRef.current?.requestFullscreen) {
        galleryRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset current index and scroll to initial image when gallery opens or initialIndex changes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
      
      // When gallery opens, scroll to the selected image
      setTimeout(() => {
        if (scrollContainerRef.current && imageRefs.current[initialIndex]) {
          imageRefs.current[initialIndex]?.scrollIntoView({ 
            behavior: 'auto',
            block: 'start'
          });
        }
      }, 50);
      
      // Set meta viewport for better mobile experience
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } else {
      // Restore scrolling when gallery closes
      document.body.style.overflow = '';
      
      // Restore default viewport settings
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowUp') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
        imageRefs.current[Math.max(0, currentIndex - 1)]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
      if (e.key === 'ArrowDown') {
        setCurrentIndex(prev => Math.min(images.length - 1, prev + 1));
        imageRefs.current[Math.min(images.length - 1, currentIndex + 1)]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose]);

  // Update current index based on scroll position
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    
    // Find which image is most visible in the viewport
    let maxVisibleArea = 0;
    let maxVisibleIndex = currentIndex;
    
    imageRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const rect = ref.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleArea = visibleHeight / rect.height;
      
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        maxVisibleIndex = index;
      }
    });
    
    if (maxVisibleIndex !== currentIndex) {
      setCurrentIndex(maxVisibleIndex);
    }
  };

  // Monitor scroll events
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <div 
      ref={galleryRef}
      className="fixed inset-0 z-[1100] bg-black touch-none"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Controls toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[1103] flex justify-between p-4 bg-black bg-opacity-50">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "bg-black bg-opacity-50 hover:bg-opacity-70 border-none text-white rounded-full",
            isFullscreen && "hidden" // Hide expand button in fullscreen mode
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen();
          }}
          aria-label="Toggle fullscreen"
        >
          <Maximize className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-none text-white rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isFullscreen) {
              document.exitFullscreen().catch(() => {});
              setIsFullscreen(false);
            } else {
              onClose();
            }
          }}
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Vertical scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto overscroll-contain"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ 
          height: '100%',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            className={cn(
              "min-h-screen w-full flex items-center justify-center p-4"
            )}
            style={{ height: '100vh' }}
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
              loading={index === initialIndex ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm z-[1103]">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default VerticalImageGallery;
