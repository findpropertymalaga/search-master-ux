
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
                Utforska Costa del Sol
              </h2>
              <p className="text-gray-600 mb-6">
                Costa del Sol sträcker sig längs Spaniens sydkust i regionen Andalusien 
                och erbjuder en perfekt blandning av medelhavsklimat, vackra stränder och rik kulturell upplevelse.
              </p>
              <p className="text-gray-600 mb-6">
                Från de glamorösa resorterna i Marbella till den charmiga gamla staden Estepona erbjuder denna region 
                ett brett utbud av fastigheter för dem som söker sitt drömhem under solen.
              </p>
              <p className="text-gray-600">
                Här hittar du också populära områden som Benalmádena – perfekt för dem som vill köpa fastighet i Spanien med äkta andalusisk småstadscharm – och närliggande Málaga, en dynamisk stad som kombinerar strandliv, kultur och urbana bekvämligheter.
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
          Varför välja Costa del Sol?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Perfekt klimat',
              description: 'Över 300 soldagar per år — Costa del Sol erbjuder ett av Europas bästa klimat.',
              icon: '☀️'
            },
            {
              title: 'Världsklass faciliteter',
              description: 'Från mästerskapsgolfbanor till lyxfastigheter — njut av det bästa av medelhavsliv.',
              icon: '⛳'
            },
            {
              title: 'Säker investering',
              description: 'Fastigheter på Costa del Sol fortsätter att vara en säker investering med stabil värdetillväxt.',
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
            Lär känna oss!
          </h2>
          
          <div className="bg-costa-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                <p className="text-gray-600 mb-4">
                  Med över 10 års erfarenhet av fastighetsmarknaden på Costa del Sol har vi blivit ett pålitligt team för köpare och investerare som vill ha expertråd och smarta möjligheter.
                </p>
                <p className="text-gray-600 mb-4">
                  Tack vare vår praktiska erfarenhet inom både försäljning och korttidsuthyrning känner vi verkligen denna region — från lovande investeringsplatser till vardagsliv.
                </p>
                <p className="text-gray-600">
                  Oavsett om du letar efter avkastning, ett andrahem eller bättre livskvalitet vid havet — vi är här för att guida dig genom varje steg. Våra erfarna juridiska rådgivare hanterar all pappersarbete, formaliteter och ser till att due diligence utförs korrekt för att säkerställa en trygg och transparent transaktion.
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
