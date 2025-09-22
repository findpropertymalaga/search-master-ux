
import React, { useEffect } from 'react';

interface PropertyListingHeaderProps {
  title: string;
}

declare global {
  interface Window {
    hbspt?: any;
  }
}

export const PropertyListingHeader = ({ 
  title 
}: PropertyListingHeaderProps) => {

  const handleSubscribeClick = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">×</button>
        <h2 class="text-2xl font-semibold mb-4 text-gray-900">Stay Updated</h2>
        <p class="text-gray-600 mb-6">Subscribe to receive the latest property updates and market insights.</p>
        <form id="newsletter-form" class="space-y-4">
          <div>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email address"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
          </div>
          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Subscribe Now
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
            body: JSON.stringify({ email, source: 'property-listing' }),
          });

          if (response.ok) {
            messageDiv!.textContent = 'Thank you for subscribing! We\'ll keep you updated.';
            messageDiv!.className = 'mt-4 text-center text-green-600 font-medium';
            (form as HTMLFormElement).style.display = 'none';
          } else {
            messageDiv!.textContent = 'Something went wrong. Please try again.';
            messageDiv!.className = 'mt-4 text-center text-red-600 font-medium';
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error);
          messageDiv!.textContent = 'Something went wrong. Please try again.';
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
    <div className="bg-white py-12">
      <div className="container-custom">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-black">
          Sign up to our <button 
            onClick={handleSubscribeClick}
            className="text-navy-600 hover:text-navy-700 underline cursor-pointer"
          >
            newsletter
          </button> for curated property updates and insights.
        </h1>
      </div>
    </div>
  );
};
