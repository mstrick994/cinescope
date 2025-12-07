// HeroInfo.jsx
const HeroInfo = ({ movie }) => {
  if (!movie) return null;

  const title =
    movie.title ||
    movie.name ||
    movie.original_title ||
    movie.original_name ||
    "Untitled";

  const yearRaw = movie.release_date || movie.first_air_date || "";
  const year = yearRaw ? yearRaw.slice(0, 4) : null;

  const ratingNumber =
    typeof movie.vote_average === "number" ? movie.vote_average : null;
  const rating = ratingNumber !== null ? ratingNumber.toFixed(1) : null;

  const isTv =
    movie.media_type === "tv" ||
    (!!movie.first_air_date && movie.media_type !== "movie");

  const mediaTypeLabel = isTv ? "Series" : "Movie";

  let runtimeMinutes = null;

  if (!isTv) {
    runtimeMinutes = movie.runtime || null;
  } else if (Array.isArray(movie.episode_run_time) && movie.episode_run_time.length) {
    runtimeMinutes = movie.episode_run_time[0];
  }

  const runtimeLabel =
    typeof runtimeMinutes === "number"
      ? (() => {
          const h = Math.floor(runtimeMinutes / 60);
          const m = runtimeMinutes % 60;
          if (!h) return `${m}m`;
          if (!m) return `${h}h`;
          return `${h}h ${m}m`;
        })()
      : null;

  const genres =
    Array.isArray(movie.genres) && movie.genres.length
      ? movie.genres.slice(0, 3).map((g) => g.name).join(" • ")
      : null;

  const overview =
    movie.overview || "No synopsis available for this title yet.";

  return (
    <div className="hero-content max-w-5xl px-5 sm:px-10 pb-16">
      {/* Title */}
      <h1 className="hero-title">{title}</h1>

      {/* Meta pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {year && <span className="hero-pill">{year}</span>}

        {rating && (
          <span className="hero-pill">
            ★ {rating}
            <span className="opacity-70"> / 10</span>
          </span>
        )}

        {runtimeLabel && <span className="hero-pill">{runtimeLabel}</span>}

        <span className="hero-pill">{mediaTypeLabel}</span>
      </div>

      {/* Genres */}
      {genres && (
        <p className="mt-2 text-xs sm:text-sm text-cine-muted">
          {genres}
        </p>
      )}

      {/* Overview */}
      <p className="hero-overview mt-4 max-w-2xl text-sm sm:text-base">
        {overview}
      </p>

      {/* Actions */}
      <div className="hero-actions">
        <button className="hero-btn hero-btn-primary">
          <span className="hero-btn-icon">▶</span>
          <span>Play Now</span>
        </button>

        <button className="hero-btn hero-btn-secondary">
          <span className="hero-btn-icon">▸</span>
          <span>Watch Trailer</span>
        </button>

        <button className="hero-btn hero-btn-tertiary" aria-label="Add to My List">
          <span className="hero-btn-icon">＋</span>
        </button>
      </div>
    </div>
  );
};

export default HeroInfo;
