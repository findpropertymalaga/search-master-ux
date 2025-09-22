
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import FeaturedPropertiesSlideshow from '@/components/FeaturedPropertiesSlideshow';
import HowItWorksSection from '@/components/HowItWorksSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Properties Slideshow */}
      <FeaturedPropertiesSlideshow />

      {/* How it Works */}
      <HowItWorksSection />

      {/* About Costa del Sol */}
      <div className="bg-costa-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-4">
                Explore Costa del Sol
              </h2>
              <p className="text-gray-600 mb-6">
                Costa del Sol stretches along Spain's southern coast in the Andalusia region 
                and offers a perfect blend of Mediterranean climate, beautiful beaches and rich cultural experience.
              </p>
              <p className="text-gray-600 mb-6">
                From the glamorous resorts of Marbella to the charming old town of Estepona, this region offers 
                a diverse range of properties for those seeking their dream home under the sun.
              </p>
              <p className="text-gray-600">
                Here you'll also find popular areas like Benalmádena – perfect for those who want to buy property in Spain with genuine Andalusian small-town charm – and nearby Málaga, a dynamic city that combines beach life, culture and urban amenities.
              </p>
            </div>
            <div className="relative h-72 rounded-lg overflow-hidden md:h-96">
              <img 
                src="/lovable-uploads/6c12a68d-be3a-43cf-a6d8-9b940e412602.png" 
                alt="Costa del Sol" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container-custom py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-8 text-center">
          Why choose Costa del Sol?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Perfect climate',
              description: 'Over 300 days of sunshine per year — Costa del Sol offers one of Europe\'s best climates.',
              icon: '☀️'
            },
            {
              title: 'World-class facilities',
              description: 'From championship golf courses to luxury properties — enjoy the best of Mediterranean living.',
              icon: '⛳'
            },
            {
              title: 'Safe investment',
              description: 'Properties on Costa del Sol continue to be a safe investment with stable value growth.',
              icon: '📈'
            },
          ].map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-serif font-medium mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Why Buy With Us? */}
      <div className="bg-white py-16" data-section="why-buy-with-us">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-8 text-center">
            Get to Know Us!
          </h2>
          
          <div className="bg-costa-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                <p className="text-gray-600 mb-4">
                  With over 10 years of experience in Costa del Sol's property market, we have become a trusted team for buyers and investors who want expert advice and smart opportunities.
                </p>
                <p className="text-gray-600 mb-4">
                  Thanks to our practical experience in both sales and short-term rentals, we truly know this region — from promising investment locations to everyday life.
                </p>
                <p className="text-gray-600">
                  Whether you're looking for returns, a second home or better quality of life by the sea — we're here to guide you through every step. Our experienced legal advisors handle all paperwork, formalities, and make sure the due diligence is properly conducted to ensure a safe and transparent transaction.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative h-48 w-48 rounded-full overflow-hidden mb-4">
                  <img 
                    src="/lovable-uploads/fff4216e-628c-43da-afaf-ca7e7db2a485.png" 
                    alt="Jakob Engfeldt, CEO" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-medium mb-1">Jakob Engfeldt</h3>
                <p className="text-costa-600 font-medium">CEO, Lingonberry Group</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
