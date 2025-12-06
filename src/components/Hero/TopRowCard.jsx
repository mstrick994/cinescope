const TopRowCard = ({ movie, isActive, onClick, index }) => {
  return (
    <div
      id={`card-${index}`}
      className={`carousel-card ${isActive ? "active" : "inactive"}`}
      onClick={onClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title || movie.name}
      />
    </div>
  );
};

export default TopRowCard;
