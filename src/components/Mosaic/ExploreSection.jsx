// src/components/Home/ExploreSection.jsx
import MovieMosaic from "../Mosaic/MovieMosaic";

const ExploreSection = () => {
  // Smoothly scrolls the user to the pricing/plans area
  const scrollToPlansSection = () => {
    const plansSectionElement = document.getElementById("plans-section");

    if (plansSectionElement) {
      plansSectionElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative w-full">
      {/* Banner wrapper – controls the visible height */}
      <div
        className="
          relative w-full
          h-[340px] sm:h-[380px] md:h-[420px] lg:h-[460px]
          overflow-hidden
        "
      >
        {/* ===============================
            BACKGROUND LAYERS
           =============================== */}
        <div className="absolute inset-0 pointer-events-none">

          {/* Poster Mosaic Background */}
          <div className="absolute inset-[-8%] opacity-95">
            <MovieMosaic />
          </div>

          {/* Purple-tinted overlay (brand color) */}
          <div
            className="absolute inset-0
              bg-gradient-to-b
              from-[#1B1034]/95
              via-[#0B0D17]/92
              to-[#0B0D17]/80"
          />

          {/* Heavy top shadow for seamless blend into TopRow */}
          <div
            className="absolute -top-24 inset-x-0 h-40
              bg-gradient-to-b
              from-black/80 via-black/40 to-transparent"
          />
        </div>

        {/* ===============================
            FOREGROUND CONTENT
           =============================== */}
        <div
          className="
            relative z-10 h-full
            flex flex-col items-center justify-center
            text-center px-4
          "
        >
          {/* Eyebrow Label */}
          <p
            className="
              text-[0.7rem] sm:text-xs
              font-semibold tracking-[0.25em]
              uppercase
              text-cine-muted
              mb-2
            "
          >
            Explore CineScope
          </p>

          {/* Main Heading */}
          <h2 className="hero-heading text-center mb-3">
            A Universe of Stories
          </h2>

          {/* Subtitle */}
          <p className="hero-subtitle text-center max-w-2xl">
            Dive into blockbuster movies, iconic series, and animated favorites —
            then choose the CineScope plan that fits how you watch.
          </p>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={scrollToPlansSection}
            className="mt-6 hero-btn hero-btn-primary"
          >
            Explore plan options
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
