const TopRowCard = ({ movie, isActive, onClick, index }) => {
  return (
    <button
      type="button"
      id={`card-${index}`}
      className={`carousel-card ${isActive ? "active" : "inactive"}`}
      onClick={onClick}
      aria-label={movie.title || movie.name || "Open title"}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title || movie.name}
      />
    </button>
  );
};

export default TopRowCard;
