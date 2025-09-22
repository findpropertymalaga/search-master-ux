
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import RentProperties from "./pages/RentProperties";
import PropertyDetails from "./pages/PropertyDetails";
import NotFound from "./pages/NotFound";

// Create QueryClient with mobile-specific settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.log(`Query retry attempt ${failureCount}:`, error);
        return failureCount < 2; // Reduced retries for mobile
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log("App component mounted");
    console.log("User Agent:", navigator.userAgent);
    console.log("Online status:", navigator.onLine);
    console.log("Connection:", (navigator as any).connection?.effectiveType || 'unknown');
    
    // Mobile-specific debugging
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    console.log("Device info:", { isMobile, isSafari, isFirefox });
    
    // Handle page visibility changes (common mobile issue)
    const handleVisibilityChange = () => {
      console.log("Page visibility changed:", document.visibilityState);
      if (document.visibilityState === 'visible') {
        console.log("Page became visible - checking connection");
        if (!navigator.onLine) {
          console.log("Device appears offline");
        }
      }
    };
    
    // Handle online/offline status
    const handleOnline = () => {
      console.log("Device came online");
    };
    
    const handleOffline = () => {
      console.log("Device went offline");
    };
    
    // Add event listeners for mobile debugging
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Force a small delay on mobile Safari to prevent race conditions
    if (isMobile && isSafari) {
      console.log("Mobile Safari detected - applying startup delay");
      setTimeout(() => {
        console.log("Mobile Safari startup delay completed");
      }, 100);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<PropertyListings />} />
                <Route path="/rent" element={<RentProperties />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
