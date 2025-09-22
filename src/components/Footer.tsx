
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

declare global {
  interface Window {
    hbspt?: any;
  }
}

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();


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
            body: JSON.stringify({ email, source: 'footer' }),
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
  };

  return (
    <footer className="bg-navy-900 text-white py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-medium mb-4">FindProperty®</h3>
            <p className="text-navy-100 mb-4">
              Riktiga råd. Riktiga hem. Costa del Sol.
            </p>
            <p className="text-navy-100">
              Estepona - Marbella - Fuengirola - Benalmádena - Torremolinos - Málaga
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-medium mb-4">Snabblänkar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-navy-100 hover:text-white transition-colors">
                  Hem
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-navy-100 hover:text-white transition-colors"
                  onClick={() => {
                    if (window.location.pathname === '/rent') {
                      // Clear all filters when switching from Rent to Buy
                      sessionStorage.removeItem('propertySearchFilters');
                      sessionStorage.removeItem('searchContext');
                      sessionStorage.removeItem('rentalSearchContext');
                      sessionStorage.removeItem('rentalPropertySortOrder');
                      sessionStorage.removeItem('buyPropertySortOrder');
                      sessionStorage.removeItem('currentProperties');
                      sessionStorage.removeItem('propertyListingScrollState_buy');
                      sessionStorage.removeItem('propertyListingScrollState_rent');
                      sessionStorage.removeItem('scrollMemory_buy');
                      sessionStorage.removeItem('scrollMemory_rent');
                    }
                  }}
                >
                  Köp
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-navy-100 hover:text-white transition-colors"
                  onClick={() => {
                    if (window.location.pathname === '/properties') {
                      // Clear all filters when switching from Buy to Rent
                      sessionStorage.removeItem('propertySearchFilters');
                      sessionStorage.removeItem('searchContext');
                      sessionStorage.removeItem('rentalSearchContext');
                      sessionStorage.removeItem('rentalPropertySortOrder');
                      sessionStorage.removeItem('buyPropertySortOrder');
                      sessionStorage.removeItem('currentProperties');
                      sessionStorage.removeItem('propertyListingScrollState_buy');
                      sessionStorage.removeItem('propertyListingScrollState_rent');
                      sessionStorage.removeItem('scrollMemory_buy');
                      sessionStorage.removeItem('scrollMemory_rent');
                    }
                  }}
                >
                  Hyr
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleAboutClick}
                  className="text-navy-100 hover:text-white transition-colors text-left"
                >
                  Om oss
                </button>
              </li>
              <li>
                <button 
                  onClick={handleNewsletterClick}
                  className="text-navy-100 hover:text-white transition-colors text-left"
                >
                  Prenumerera på nyhetsbrev
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-medium mb-4">Kontakt</h3>
            <p className="text-navy-100 mb-2">
              E-post: hello@findproperty.es
            </p>
            <p className="text-navy-100 mb-2">
              Telefon: +34 691 91 60 10
            </p>
            <p className="text-navy-100">
              Adress: Avenida Aguamarina 66, 29631 Benalmádena (Málaga)
            </p>
          </div>
        </div>
        
        <div className="border-t border-navy-700 mt-8 pt-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Desktop Logo Layout */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              <img 
                src="/lovable-uploads/231c104f-e407-45fd-999a-18e0a7e7cc9d.png" 
                alt="FindProperty Logo" 
                className="h-[26px] w-auto"
              />
              
              <img 
                src="/lovable-uploads/ee54e923-ab7d-41b0-b97d-99c7f9205c0b.png" 
                alt="Lingonberry Group Logo" 
                className="h-12 w-auto"
              />
              
              <a href="https://bnbhelper.es/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/a2eba4d0-2415-4553-b219-e771a78f03df.png" 
                  alt="BnBHelper Logo" 
                  className="h-12 w-auto"
                />
              </a>
            </div>

            {/* Mobile Logo Layout */}
            <div className="md:hidden flex items-center justify-center space-x-8">
              <img 
                src="/lovable-uploads/231c104f-e407-45fd-999a-18e0a7e7cc9d.png" 
                alt="FindProperty Logo" 
                className="h-[26px] w-auto"
              />
              
              <a href="https://bnbhelper.es/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/b6681a9a-3621-4397-b911-d7487d24510c.png" 
                  alt="BnBHelper Logo" 
                  className="h-12 w-auto"
                />
              </a>
            </div>

            <div className="text-center text-navy-200">
              <p className="mb-4">
                FindProperty® är din pålitliga ingång till fastigheter och investeringsmöjligheter på Costa del Sol. För korttidsuthyrning har <a href="https://bnbhelper.es/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-navy-100 transition-colors">BnBHelper®</a> hjälpt fastighetsägare och investerare att maximera avkastning sedan 2016. Båda varumärkena är del av Lingonberry Group och bidrar med djup expertis och ett resultatdrivet tillvägagångssätt för fastighetsförsäljning och uthyrning.
              </p>
              <p className="mb-4">Riktiga råd. Riktiga hem. Costa del Sol.™</p>
              
              {/* Mobile: Lingonberry Group logo after Costa del Sol.™ */}
              <div className="md:hidden flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/ee54e923-ab7d-41b0-b97d-99c7f9205c0b.png" 
                  alt="Lingonberry Group Logo" 
                  className="h-12 w-auto"
                />
              </div>
              
              <p className="mb-4">© 2023-2025 Lingonberry Group, S.L. B72979321</p>
              
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.instagram.com/bnbhelper_rentals?igsh=MW50dGNpbmtuYTltNg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-navy-200 hover:text-white transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1AoWzoLrc7/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-navy-200 hover:text-white transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
