// src/components/Browse Categories/BrowseSection.jsx
import { useState, useEffect } from "react";
import { getBackdropPathForTitle } from "../../API/tmdb";

const BROWSE_TABS = {
  movies: {
    id: "movies",
    label: "Movies",
    tmdbTitle: "Mission: Impossible - Dead Reckoning Part One",
    mediaType: "movie",
    hero: {
      eyebrow: "Browse Movies",
      title: "Blockbuster hits, thrillers, sci-fi & more.",
      description:
        "Explore cinematic favorites, new releases, and award-winning films all in one place.",
      gradient: "from-[#0B0D17] via-[#141633] to-[#2A39FF]", // cine purple/blue
    },
    rows: [
      {
        id: "movie-dramas",
        title: "Powerful dramas",
        type: "movie",
        filter: { genre: "Drama" },
      },
      {
        id: "movie-comedies",
        title: "Feel-good comedies",
        type: "movie",
        filter: { genre: "Comedy" },
      },
      {
        id: "movie-action",
        title: "High-octane action",
        type: "movie",
        filter: { genre: "Action" },
      },
    ],
  },

  tv: {
    id: "tv",
    label: "TV Shows",
    tmdbTitle: "The Office",
    mediaType: "tv",
    hero: {
      eyebrow: "Browse TV Shows",
      title: "Sitcoms, dramas, and bingeworthy series.",
      description:
        "From comfort rewatches to edge-of-your-seat dramas, find the next show to marathon.",
      gradient: "from-[#0B0D17] via-[#111827] to-[#00D8FF]", // darker, more teal
    },
    rows: [
      {
        id: "tv-sitcoms",
        title: "Top sitcoms",
        type: "tv",
        filter: { genre: "Comedy" },
      },
      {
        id: "tv-thrillers",
        title: "Intense thrillers",
        type: "tv",
        filter: { genre: "Thriller" },
      },
      {
        id: "tv-bingeworthy",
        title: "Bingeworthy series",
        type: "tv",
        filter: { tag: "bingeworthy" },
      },
    ],
  },

  animation: {
    id: "animation",
    label: "Animation",
    tmdbTitle: "Akira",
    mediaType: "movie",
    hero: {
      eyebrow: "Browse Animation",
      title: "Family favorites, anime, and more.",
      description:
        "Cue up cozy family nights, iconic animated movies, or your favorite anime worlds.",
      gradient: "from-[#0B0D17] via-[#241336] to-[#AB8BFF]", // more purple
    },
    rows: [
      {
        id: "anim-family",
        title: "Family & kids picks",
        type: "movie",
        filter: { genre: "Family" },
      },
      {
        id: "anim-anime",
        title: "Popular anime",
        type: "tv",
        filter: { genre: "Animation", tag: "anime" },
      },
      {
        id: "anim-hybrid",
        title: "Animated movies",
        type: "movie",
        filter: { genre: "Animation" },
      },
    ],
  },
};

const BrowseSection = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [heroBackgrounds, setHeroBackgrounds] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const activeConfig = BROWSE_TABS[activeTab];

  // Fetch TMDB backdrops for each tab once on mount (simpler version)
  useEffect(() => {
    let cancelled = false;

    const loadBackdrops = async () => {
      const backgroundsByTabId = {};

      for (const [tabId, tabConfig] of Object.entries(BROWSE_TABS)) {
        try {
          const path = await getBackdropPathForTitle(
            tabConfig.tmdbTitle,
            tabConfig.mediaType
          );

          if (path) {
            backgroundsByTabId[tabId] =
              `https://image.tmdb.org/t/p/original${path}`;
          } else {
            backgroundsByTabId[tabId] = null;
          }
        } catch (error) {
          console.error("Error loading browse backdrop for", tabId, error);
          backgroundsByTabId[tabId] = null;
        }
      }

      if (!cancelled) {
        setHeroBackgrounds(backgroundsByTabId);
      }
    };

    loadBackdrops();

    return () => {
      cancelled = true;
    };
  }, []);

  // Small loading window for a smoother transition
  useEffect(() => {
    if (!isLoading) return;

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 350); // tweak for faster/slower fade

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleTabChange = (nextTabId) => {
    if (nextTabId === activeTab) return; // already on this tab

    setIsLoading(true);
    setActiveTab(nextTabId);
  };

  return (
    <section className="w-full bg-cine-bg">
      {/* HERO AREA */}
      <div className="relative w-full overflow-hidden">
        {/* Background image from TMDB */}
        <div
          className={`
            absolute inset-0 bg-cover bg-center bg-no-repeat
            transition-opacity duration-300
            ${isLoading ? "opacity-0" : "opacity-100"}
          `}
          style={{
            backgroundImage: heroBackgrounds[activeTab]
              ? `url(${heroBackgrounds[activeTab]})`
              : "none",
          }}
        />

        {/* Gradient overlay that changes per tab */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-br
            ${activeConfig.hero.gradient}
             opacity-75 md:opacity-80
          `}
        />

        {/* Foreground content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
          {/* Tabs (Movies / TV Shows / Animation) */}
          <div className="flex gap-6 text-sm font-medium text-white/70 mb-6">
            {Object.values(BROWSE_TABS).map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    pb-2 relative
                    transition-colors
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-[2px] h-[3px] w-10 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Eyebrow text */}
          <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-2">
            {activeConfig.hero.eyebrow}
          </p>

          {/* Big title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-xl">
            {activeConfig.hero.title}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/80 max-w-xl mb-6">
            {activeConfig.hero.description}
          </p>

          {/* CTA – wire later to scroll or navigate */}
          <button
            type="button"
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-full
              bg-white text-cine-bg font-semibold text-sm
              shadow-lg shadow-black/40
              hover:bg-slate-100
              transition-colors
            "
          >
            Explore {activeConfig.label.toLowerCase()}
          </button>
        </div>
      </div>

      {/* ROW AREA – temp placeholder, we’ll replace with BrowseRow later */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-white/60 text-sm">
        <p>
          Rows for <span className="font-semibold">{activeConfig.label}</span>{" "}
          will go here (Dramas, Comedies, Anime, etc). We&apos;ll build this
          next.
        </p>
      </div>
    </section>
  );
};

export default BrowseSection;
