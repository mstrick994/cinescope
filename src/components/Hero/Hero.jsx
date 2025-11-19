const Hero = ({ movie, children }) => {
  return (
    <section 
      className="hero-container"
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
      }}
    >
      <div className="overlay-cine" />
      {children}
    </section>
  );
};

export default Hero;
