import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Hitta en fastighet att köpa eller hyra',
      description: 'Bläddra bland vår omfattande portfölj av premiefastigheter över hela Costa del Sol. Använd våra avancerade filter för att hitta det perfekta hemmet som matchar din budget, platsönskemål och livsstilsbehov.'
    },
    {
      number: '2', 
      title: 'Kontakta oss!',
      description: 'Kontakta vårt erfarna team av fastighetsspecialister som kommer att guida dig genom hela processen. Vi ger personlig rådgivning och bokar visningar när det passar dig.'
    },
    {
      number: '3',
      title: 'Vi ordnar allt',
      description: 'Från köpförhandlingar till hyreskontrakt hanterar våra erfarna juridiska rådgivare all pappersarbete och formaliteter. Njut av en smidig, stressfri fastighetsförvärvsprocess.'
    }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-6">
            Så här fungerar det
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Din resa till att hitta den perfekta fastigheten på Costa del Sol börjar här. 
            Vi gör processen enkel, transparent och stressfri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                {/* Floating step number */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Progress line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2 z-10">
                    <div className="absolute right-0 w-2 h-2 bg-gray-400 rounded-full transform translate-x-1 -translate-y-0.5"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;