
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, Building, User, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const halfPageHeight = window.innerHeight / 2;
      setShowFloatingMenu(scrollPosition > halfPageHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const aboutSection = document.querySelector('[data-section="why-buy-with-us"]');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on the home page, just scroll
      const aboutSection = document.querySelector('[data-section="why-buy-with-us"]');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsOpen(false);
  };

  // Function to clear all filters when switching between buy/rent
  const clearAllFilters = () => {
    // Clear session storage
    sessionStorage.removeItem('propertySearchFilters');
    sessionStorage.removeItem('searchContext');
    sessionStorage.removeItem('rentalSearchContext');
    sessionStorage.removeItem('rentalPropertySortOrder');
    sessionStorage.removeItem('buyPropertySortOrder');
    sessionStorage.removeItem('currentProperties');
    
    // Clear scroll memory
    sessionStorage.removeItem('propertyListingScrollState_buy');
    sessionStorage.removeItem('propertyListingScrollState_rent');
    sessionStorage.removeItem('scrollMemory_buy');
    sessionStorage.removeItem('scrollMemory_rent');
    
    console.log('Cleared all filters when switching between buy/rent sections');
  };

  const handleNewsletterClick = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">×</button>
        <h2 class="text-2xl font-semibold mb-4 text-gray-900">Håll dig uppdaterad</h2>
        <p class="text-gray-600 mb-6">Prenumerera för att få de senaste fastighetsuppdateringarna och marknadsinsikterna.</p>
        <form id="newsletter-form" class="space-y-4">
          <div>
            <input 
              type="email" 
              id="email" 
              placeholder="Ange din e-postadress"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
          </div>
          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Prenumerera nu
          </button>
        </form>
        <div id="form-message" class="mt-4 text-center hidden"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('#newsletter-form');
    const messageDiv = modal.querySelector('#form-message');
    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (modal.querySelector('#email') as HTMLInputElement)?.value;
      
      if (email) {
        try {
          const response = await fetch('https://iuolqlhuiwffgnoaelpg.supabase.co/functions/v1/newsletter-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, source: 'navbar' }),
          });

          if (response.ok) {
            messageDiv!.textContent = 'Tack för din prenumeration! Vi håller dig uppdaterad.';
            messageDiv!.className = 'mt-4 text-center text-green-600 font-medium';
            (form as HTMLFormElement).style.display = 'none';
          } else {
            messageDiv!.textContent = 'Något gick fel. Försök igen.';
            messageDiv!.className = 'mt-4 text-center text-red-600 font-medium';
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error);
          messageDiv!.textContent = 'Något gick fel. Försök igen.';
          messageDiv!.className = 'mt-4 text-center text-red-600 font-medium';
        }
        messageDiv!.classList.remove('hidden');
      }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    setIsOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Try to navigate parent window to root domain
    if (window.parent !== window) {
      // We're in an iframe, send message to parent
      window.parent.postMessage({ type: 'NAVIGATE_HOME' }, '*');
    } else {
      // Not in iframe, use regular navigation
      navigate('/');
    }
    setIsOpen(false);
  };

  const menuItems = [
    { name: 'Hem', action: handleHomeClick, icon: Home },
    { name: 'Köp', path: '/properties', icon: Building },
    { name: 'Hyr', path: '/rent', icon: Building },
    { name: 'Om oss', action: handleAboutClick, icon: User },
    { name: 'Nyhetsbrev', action: handleNewsletterClick, icon: Mail },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                // Clear filters when navigating to home
                sessionStorage.removeItem('propertySearchFilters');
                // Navigate parent window if in iframe
                if (window.parent !== window) {
                  window.parent.postMessage({ type: 'NAVIGATE_HOME' }, '*');
                } else {
                  navigate('/');
                }
              }}
            >
              <img 
                src="/lovable-uploads/bc4030c5-844b-4705-a569-3bc10935bfde.png" 
                alt="FindProperty" 
                className="h-[30px] w-auto"
              />
            </a>

            {/* Mobile Lingonberry Logo - Far Right */}
            <div className="md:hidden">
              <img 
                src="/lovable-uploads/99a129c6-4db6-4427-8c73-6865e0ffdd63.png" 
                alt="By Lingonberry Group" 
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {menuItems.map((item) => {
                if (item.action) {
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="flex items-center text-sm font-medium transition-colors hover:text-navy-600 text-gray-600 select-text bg-transparent border-none p-0 cursor-pointer"
                    >
                      {item.name}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center text-sm font-medium transition-colors hover:text-navy-600
                      ${location.pathname === item.path ? 'text-navy-600' : 'text-gray-600'}`}
                    onClick={() => {
                      if (item.path === '/') {
                        // Clear filters when navigating to home
                        sessionStorage.removeItem('propertySearchFilters');
                      } else if (item.path === '/properties' && location.pathname === '/rent') {
                        // Switching from Rent to Buy - clear all filters
                        clearAllFilters();
                      } else if (item.path === '/rent' && location.pathname === '/properties') {
                        // Switching from Buy to Rent - clear all filters
                        clearAllFilters();
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Centered Lingonberry Logo on Desktop */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="/lovable-uploads/99a129c6-4db6-4427-8c73-6865e0ffdd63.png" 
                alt="By Lingonberry Group" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Mobile Menu - Only show when floating menu is active */}
          {isOpen && showFloatingMenu && (
            <div className="mt-4 pb-4 md:hidden animate-fade-in fixed top-16 left-4 right-4 bg-white rounded-lg shadow-lg border z-40">
              <div className="flex flex-col space-y-4 p-4">
                {menuItems.map((item) => {
                  if (item.action) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        className="flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-navy-50 hover:text-navy-600 text-gray-600 text-left select-text bg-transparent border-none cursor-pointer"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </button>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-navy-50 hover:text-navy-600
                        ${location.pathname === item.path ? 'text-navy-600 bg-navy-50' : 'text-gray-600'}`}
                       onClick={() => {
                         setIsOpen(false);
                         if (item.path === '/') {
                           // Clear filters when navigating to home
                           sessionStorage.removeItem('propertySearchFilters');
                         } else if (item.path === '/properties' && location.pathname === '/rent') {
                           // Switching from Rent to Buy - clear all filters
                           clearAllFilters();
                         } else if (item.path === '/rent' && location.pathname === '/properties') {
                           // Switching from Buy to Rent - clear all filters
                           clearAllFilters();
                         }
                       }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Floating Menu Button - Mobile Only */}
      {showFloatingMenu && (
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <Button 
            variant="default" 
            size="icon" 
            onClick={toggleMenu} 
            aria-label="Menu"
            className="bg-navy-600 hover:bg-navy-700 shadow-lg rounded-full w-12 h-12 animate-fade-in"
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Navbar;
