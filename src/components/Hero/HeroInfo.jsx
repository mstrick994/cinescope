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

  // =============================
  // NEW → CERTIFICATION LOGIC
  // =============================
  let certification = null;

  if (isTv && movie.content_ratings?.results) {
    const us = movie.content_ratings.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    certification = us?.rating || null;
  }

  if (!isTv && movie.release_dates?.results) {
    const us = movie.release_dates.results.find(
      (r) => r.iso_3166_1 === "US"
    );

    if (us?.release_dates?.length) {
      const withCert = us.release_dates.find(
        (d) => d.certification && d.certification.trim() !== ""
      );
      certification = withCert?.certification || null;
    }
  }
  // =============================

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

    {/* Content Wrapper */}
    <div>
      {/* Meta pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <span className="hero-pill">{mediaTypeLabel}</span>
        {year && <span className="hero-pill">{year}</span>}

        {rating && (
          <span className="hero-pill">
            ★ {rating}
            <span className="opacity-70"> / 10</span>
          </span>
        )}

        {runtimeLabel && <span className="hero-pill">{runtimeLabel}</span>}

        {certification && (
          <span className="hero-pill">{certification}</span>
        )}
      </div>

      {/* Genres */}
      {genres && (
        <p className="mt-2 text-xs sm:text-sm text-cine-muted">
          {genres}
        </p>
      )}

      {/* Overview */}
      <p className="hero-subtitle hero-overview mt-4 max-w-2xl">
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

        <button
          className="hero-btn hero-btn-tertiary"
          aria-label="Add to My List"
        >
          <span className="hero-btn-icon">＋</span>
        </button>
      </div>
    </div>
  </div>
);

};

export default HeroInfo;
