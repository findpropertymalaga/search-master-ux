
interface HeroContentProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const HeroContent = ({ title, subtitle, children }: HeroContentProps) => {
  return (
    <div className="container-custom relative py-20 md:py-32 lg:py-40">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-white/90 mb-8">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
};

export default HeroContent;
