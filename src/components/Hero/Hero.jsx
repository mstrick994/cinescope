import SmoothBackground from "../Utility Components/SmoothBackground";

const Hero = ({ movie, children }) => {
  const bgUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <SmoothBackground
      imageUrl={bgUrl}
      containerClassName="hero-container"
      bgClassName="hero-bg"
      overlayClassName="hero-overlay"
      contentClassName="hero-content"
    >
      {children}
    </SmoothBackground>
  );
};

export default Hero;
