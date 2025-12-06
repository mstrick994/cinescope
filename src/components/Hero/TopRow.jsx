import TopRowCard from "./TopRowCard";
import { useState, useEffect } from "react";

const TopRow = ({ trending, onChangeHero }) => {
  const movies = trending.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!trending || trending.length === 0) return;
    const movie = trending[activeIndex];
    if (movie) onChangeHero(movie);
  }, [activeIndex, trending, onChangeHero]);

const handleActive = (index) => {
  setActiveIndex(index);

  // Wait for card animation to finish
  setTimeout(() => {
    document.getElementById(`card-${index}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }, 320); // match your 300ms transition
};


  return (
    <section className="trending-section">
      <h2 className="trending-title text-2xl font-bold ml-4">
        Top Trending Now
      </h2>

      <div className="carousel-row">
          {/*Ghost spacer so first card never gets clipped */}
        <div className="snap-spacer" aria-hidden="true" />
        {movies.map((movie, idx) => (
          <TopRowCard
            key={movie.id}
            movie={movie}
            isActive={idx === activeIndex}
            index={idx}                         // pass it down
            onClick={() => handleActive(idx)}   // use the scroll logic
          />
        ))}

        {/* Right spacer */}
  <div className="snap-spacer-right" aria-hidden="true" />
      </div>
    </section>
  );
};

export default TopRow;
