
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { X, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ImageGallery = ({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
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
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Control body scroll and set up on component mount/unmount
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
      
      // Disable pinch zoom on mobile for better experience
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } else {
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
  useEffect(() => {
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
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={galleryRef}
      className="fixed inset-0 z-[1100] bg-black touch-none"
      onClick={onClose}
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Controls toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[1103] flex justify-between p-4 bg-black bg-opacity-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-none text-white rounded-full"
          onClick={(e) => {
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
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Simple horizontal swipable container for mobile */}
      <div 
        ref={scrollContainerRef}
        className="h-full w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Current image */}
          <img 
            src={images[currentIndex]} 
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Navigation buttons */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-black bg-opacity-40 hover:bg-opacity-60 border-none text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
            
            <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="bg-black bg-opacity-40 hover:bg-opacity-60 border-none text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
