const Hero = ({ movie, children}) => {
  const bgUrl = movie
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <section className="hero-container">
      
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        {children}
      </div>

    </section>
  );
};

export default Hero;
