// src/components/Browse Categories/TitleCard.jsx

const buildPosterUrl = (posterPath) =>
  posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : null;

const getTitle = (item) =>
  item?.title ||
  item?.name ||
  item?.original_title ||
  item?.original_name ||
  "Untitled";

const TitleCard = ({
  item,
  mediaType = "movie",

  // future-proof props (optional):
  // onOpenDetails: when user clicks the card
  // onOpenMenu: when user clicks the 3-dot button (later)
  onOpenDetails,
  onOpenMenu,
}) => {
  const posterUrl = buildPosterUrl(item?.poster_path);
  const title = getTitle(item);

  const handleOpenDetails = () => {
    if (typeof onOpenDetails === "function") {
      onOpenDetails({ item, mediaType });
    }
  };

  const handleOpenMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof onOpenMenu === "function") {
      onOpenMenu({ item, mediaType });
    }
  };

  return (
    <div
      className="
        group relative
        w-[44vw] max-w-[190px]
        sm:w-[30vw] sm:max-w-[210px]
        md:w-[220px]
        lg:w-[230px]
        shrink-0
        snap-start
        rounded-2xl
        overflow-hidden
        bg-white/5
        transition-colors duration-300
        hover:bg-white/10
      "
    >
      {/* Main click target (separate from menu button to avoid nested buttons) */}
      <button
        type="button"
        aria-label={title}
        onClick={handleOpenDetails}
        className="absolute inset-0 z-[1] focus:outline-none focus-visible:ring-inset focus-visible:ring-4 focus-visible:ring-cine-highlight/80"
      />

      {/* Poster */}
      <div className="relative aspect-[2/3] w-full">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}

        {/* Faint glow overlay on hover (Hulu-like) */}
        <div
          className="
            pointer-events-none absolute inset-0
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            bg-gradient-to-tr from-cine-highlight/20 via-cine-highlight/5 to-transparent
          "
        />
      </div>

      {/* Glow border (wraps whole card) */}
      <div
        className="
          pointer-events-none absolute inset-0
          rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ring-inset ring-4 ring-cine-highlight/80
        "
      />

      {/* 3-dot menu button (always present, only shown on hover) */}
      <button
        type="button"
        aria-label={`More options for ${title}`}
        onClick={handleOpenMenu}
        className="
          absolute right-2 top-2 z-[2]
          h-9 w-9
          rounded-full
          bg-black/45 border border-white/10
          text-white/80 hover:text-white hover:bg-black/60
          backdrop-blur
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          flex items-center justify-center
        "
      >
        <span className="text-lg leading-none">⋮</span>
      </button>
    </div>
  );
};

export default TitleCard;
