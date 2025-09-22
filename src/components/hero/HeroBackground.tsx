
interface HeroBackgroundProps {
  imageUrl: string;
}

const HeroBackground = ({ imageUrl }: HeroBackgroundProps) => {
  // Ensure HTTPS URL for security
  const secureImageUrl = imageUrl.startsWith('http://') 
    ? imageUrl.replace('http://', 'https://') 
    : imageUrl;

  return (
    <>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${secureImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-costa-950/70 to-costa-900/50"></div>
      </div>
    </>
  );
};

export default HeroBackground;
