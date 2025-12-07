import TopRowCard from "./TopRowCard";
import { useState, useEffect } from "react";
import { getTitleDetails } from "../../API/tmdb";

const TopRow = ({ trending, onChangeHero }) => {
  const movies = trending.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const movie = movies[activeIndex];
    if (!movie) return;

    let cancelled = false;

    const loadDetails = async () => {
      try {
        // movie vs tv — fall back if media_type is missing
        const mediaType =
          movie.media_type ||
          (movie.first_air_date ? "tv" : "movie");

        const details = await getTitleDetails(movie.id, mediaType);

        if (!cancelled) {
          onChangeHero(details); // full details: genres, runtime, etc.
        }
      } catch (err) {
        console.error("Error loading title details", err);
        if (!cancelled) {
          // fallback: still show the basic trending item
          onChangeHero(movie);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [activeIndex, movies, onChangeHero]);

  const handleActive = (index) => {
    setActiveIndex(index);

    // Wait for card animation to finish
    setTimeout(() => {
      document.getElementById(`card-${index}`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 320); // match your 300ms transition
  };

  return (
    <section className="trending-section">
      <h2 className="trending-title text-2xl font-bold ml-4">
        Top Trending Now
      </h2>

      <div className="carousel-row">
        {/* Ghost spacer so first card never gets clipped */}
        <div className="snap-spacer" aria-hidden="true" />

        {movies.map((movie, idx) => (
          <TopRowCard
            key={movie.id}
            movie={movie}
            isActive={idx === activeIndex}
            index={idx}
            onClick={() => handleActive(idx)}
          />
        ))}

        {/* Right spacer */}
        <div className="snap-spacer-right" aria-hidden="true" />
      </div>
    </section>
  );
};

export default TopRow;
