// src/components/Browse Categories/BrowseRow.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { discoverTitles, getTrendingTitles } from "../../API/tmdb";
import TitleCard from "./TitleCard";

const MAX_ITEMS = 16;

const ROW_CACHE_TTL_MS = 5 * 60 * 1000;
const rowResultCache = new Map();

function getFreshCachedRow(key) {
  const entry = rowResultCache.get(key);
  if (!entry || !entry.data) return null;
  if (Date.now() - entry.ts > ROW_CACHE_TTL_MS) return null;
  return entry.data;
}

async function fetchRowWithCache(key, fetcher) {
  const existing = rowResultCache.get(key);
  if (existing?.promise) return existing.promise;

  const promise = (async () => {
    const data = await fetcher();
    rowResultCache.set(key, { ts: Date.now(), data });
    return data;
  })().catch((err) => {
    rowResultCache.delete(key);
    throw err;
  });

  rowResultCache.set(key, { ts: Date.now(), promise });
  return promise;
}

/**
 * ============================================================
 * Helpers
 * ============================================================
 */

// Remove duplicate IDs while preserving order
function uniqueById(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (!item?.id) continue;
    const key = String(item.id);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

// Fisher-Yates shuffle
function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Find "primary genre" as the FIRST genre id returned by TMDB.
 * In TMDB, `genre_ids` is ordered (and often matches “most important” first).
 * This is not perfect, but it’s the closest cheap signal you can enforce
 * without fetching full details for every card.
 */
function getPrimaryGenreId(item) {
  const ids = item?.genre_ids;
  if (!Array.isArray(ids) || ids.length === 0) return null;
  return ids[0];
}

/**
 * Strict-ish shelf enforcement:
 * - includeGenreIds: we REQUIRE the primary genre to be one of these.
 *   (This solves “House” in Comedy and “Zootopia” in Action)
 * - excludeGenreIds: if item contains any excluded genre, drop it
 *
 * If you want it looser later, change primary check to "includes" instead of primary.
 */
function filterByShelfRules(
  items,
  {
    includeGenreIds,
    excludeGenreIds,
    allowMixed = false,
    requireAllInclude = false,
  }
) {
  const include = Array.isArray(includeGenreIds) ? includeGenreIds : [];
  const exclude = Array.isArray(excludeGenreIds) ? excludeGenreIds : [];

  return items.filter((item) => {
    const ids = Array.isArray(item?.genre_ids) ? item.genre_ids : [];

    // If excluded genre shows up anywhere, drop it
    if (exclude.length > 0 && ids.some((g) => exclude.includes(g)))
      return false;

    // If include list exists
    if (include.length > 0) {
      if (requireAllInclude) {
        // Require ALL included genres to be present (ex: Animation + Family)
        return include.every((g) => ids.includes(g));
      }

      if (allowMixed) {
        // Loose: must include ANY of the include genres
        return ids.some((g) => include.includes(g));
      } else {
        // Strict: primary genre must match one of them
        const primary = getPrimaryGenreId(item);
        return primary != null && include.includes(primary);
      }
    }

    return true;
  });
}

/**
 * Weighted blend:
 * - popular + trending dominate early
 * - top rated sprinkled in
 */
function buildWeightedMix({ popular, trending, topRated }, limit = MAX_ITEMS) {
  const weights = { popular: 0.5, trending: 0.3, topRated: 0.2 };

  const buckets = {
    popular: shuffle(popular),
    trending: shuffle(trending),
    topRated: shuffle(topRated),
  };

  const out = [];

  while (out.length < limit) {
    const totalLeft =
      buckets.popular.length +
      buckets.trending.length +
      buckets.topRated.length;

    if (totalLeft === 0) break;

    const r = Math.random();
    let pick = "popular";

    if (r < weights.popular) pick = "popular";
    else if (r < weights.popular + weights.trending) pick = "trending";
    else pick = "topRated";

    if (buckets[pick].length === 0) {
      if (buckets.popular.length) pick = "popular";
      else if (buckets.trending.length) pick = "trending";
      else pick = "topRated";
    }

    const next = buckets[pick].shift();
    if (next) out.push(next);
  }

  return uniqueById(out).slice(0, limit);
}

/**
 * Pull multiple pages until we have enough AFTER filtering.
 * This is the key to:
 * - fixing "only 1 crime show" moments
 * - reducing load time vs always pulling 3 pages no matter what
 */
async function collectEnoughPages(fetchPageFn, { maxPages = 3, needed = 24 }) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const results = await fetchPageFn(page);
    all.push(...(results ?? []));
    if (all.length >= needed) break;
  }
  return all;
}

const BrowseRow = ({
  title,
  mediaType = "movie",

  /**
   * NEW FILTER SHAPE:
   * filter: {
   *   includeGenreIds: number[],
   *   excludeGenreIds: number[],
   *   originalLanguage?: string,
   *   keywordQuery?: string
   * }
   */
  filter = {},

  // "popular" | "top_rated" | "trending" | "mix"
  mode = "mix",
  modes = ["popular", "trending", "top_rated"],

  minVotes,
}) => {
  const rowRef = useRef(null);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = rowRef.current;
    if (!el) return;

    // Use a small epsilon to avoid off-by-one jitter
    const epsilon = 2;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > epsilon);
    setCanScrollRight(el.scrollLeft < maxLeft - epsilon);
  };

  // ----- Filters -----
  const includeGenreIds = filter?.includeGenreIds;
  const excludeGenreIds = filter?.excludeGenreIds;
  const allowMixed = filter?.allowMixed ?? false;
  const requireAllInclude = filter?.requireAllInclude ?? false;
  const originalLanguage = filter?.originalLanguage;
  const keywordQuery = filter?.keywordQuery;
  const certificationCountry = filter?.certificationCountry;
  const certificationLte = filter?.certificationLte;

  // 안정적인 dep 비교를 위해 string key로 만듦
  const includeKey = useMemo(
    () => (Array.isArray(includeGenreIds) ? includeGenreIds.join(",") : ""),
    [includeGenreIds]
  );
  const excludeKey = useMemo(
    () => (Array.isArray(excludeGenreIds) ? excludeGenreIds.join(",") : ""),
    [excludeGenreIds]
  );
  const modesKey = useMemo(
    () => (Array.isArray(modes) ? modes.join("|") : ""),
    [modes]
  );

  const effectiveMinVotes = useMemo(() => {
    if (typeof minVotes === "number") return minVotes;
    return mediaType === "tv" ? 200 : 500;
  }, [minVotes, mediaType]);

  /**
   * If you have NO include genres, this row can't be “shelf-accurate”.
   * (Essentials is fine because it intentionally mixes.)
   */
  const hasShelf = useMemo(() => {
    return Array.isArray(includeGenreIds) && includeGenreIds.length > 0;
  }, [includeGenreIds]);

  // Only refetch when request meaningfully changes
  const requestKey = useMemo(() => {
    return [
      title,
      mediaType,
      mode,
      modesKey,
      includeKey,
      excludeKey,
      allowMixed ? "mixed" : "strict",
      requireAllInclude ? "all" : "any",
      certificationCountry ?? "",
      certificationLte ?? "",
      String(effectiveMinVotes),
      originalLanguage ?? "",
      keywordQuery ?? "",
    ].join("::");
  }, [
    title,
    mediaType,
    mode,
    modesKey,
    includeKey,
    excludeKey,
    allowMixed,
    requireAllInclude,
    certificationCountry,
    certificationLte,
    effectiveMinVotes,
    originalLanguage,
    keywordQuery,
  ]);

  useEffect(() => {
    let cancelled = false;

    const cached = getFreshCachedRow(requestKey);
    if (cached) {
      setHasError(false);
      setIsLoading(false);
      setItems(cached);
      return () => {
        cancelled = true;
      };
    }

    // Keep requests low to avoid TMDB rate limits.
    // We start with 1 page; we only pull extra pages when we truly need them.
    const loadDiscoverPaged = async (sortBy, maxPages = 1) => {
      const raw = await collectEnoughPages(
        (page) =>
          discoverTitles({
            mediaType,
            page,
            sortBy,
            includeGenreIds,
            excludeGenreIds,
            minVotes: sortBy.includes("vote_average")
              ? effectiveMinVotes
              : undefined,
            originalLanguage,
            keywordQuery,
            certificationCountry,
            certificationLte,
          }),
        { maxPages, needed: 30 }
      );

      return raw;
    };

    const loadTrendingPaged = async (maxPages = 1) => {
      const raw = await collectEnoughPages(
        (page) => getTrendingTitles(mediaType, "week", page),
        { maxPages, needed: 40 }
      );

      // trending doesn’t support discover filters, so we apply them client-side
      return raw;
    };

    const applyShelfRules = (list) => {
      if (!hasShelf) return list;

      return filterByShelfRules(list, {
        includeGenreIds,
        excludeGenreIds,
        allowMixed,
        requireAllInclude,
      });
    };

    const fillIfTooSmall = async (current) => {
      // If strict primary matching is too strict, we fill in a controlled way.
      // - strict shelves: allow the include genre in the top 2 genre slots
      // - mixed shelves: allow include genre anywhere
      if (!hasShelf) return current;
      if (current.length >= MAX_ITEMS) return current;

      const include = Array.isArray(includeGenreIds) ? includeGenreIds : [];
      const exclude = Array.isArray(excludeGenreIds) ? excludeGenreIds : [];

      // Pull another discover batch, then loosen slightly:
      const more = await loadDiscoverPaged("popularity.desc", 3);

      const looser = more.filter((item) => {
        const ids = Array.isArray(item?.genre_ids) ? item.genre_ids : [];
        if (exclude.length > 0 && ids.some((g) => exclude.includes(g)))
          return false;

        if (include.length > 0) {
          if (allowMixed) {
            if (!ids.some((g) => include.includes(g))) return false;
          } else {
            const primary = ids[0];
            const secondary = ids[1];
            if (primary == null && secondary == null) return false;
            if (!(include.includes(primary) || include.includes(secondary)))
              return false;
          }
        }

        return true;
      });

      return uniqueById([...current, ...looser]).slice(0, MAX_ITEMS);
    };

    const load = async () => {
      try {
        setHasError(false);
        setIsLoading(true);

        const results = await fetchRowWithCache(requestKey, async () => {
          const wantsPopular =
            mode === "mix" ? modes.includes("popular") : mode === "popular";
          const wantsTrending =
            mode === "mix" ? modes.includes("trending") : mode === "trending";
          const wantsTopRated =
            mode === "mix" ? modes.includes("top_rated") : mode === "top_rated";

          // 1 page per bucket to start (low request volume)
          const [popularRaw, trendingRaw, topRatedRaw] = await Promise.all([
            wantsPopular
              ? loadDiscoverPaged("popularity.desc", 1)
              : Promise.resolve([]),
            wantsTrending ? loadTrendingPaged(1) : Promise.resolve([]),
            wantsTopRated
              ? loadDiscoverPaged("vote_average.desc", 1)
              : Promise.resolve([]),
          ]);

          const popular = uniqueById(applyShelfRules(popularRaw));
          const topRated = uniqueById(applyShelfRules(topRatedRaw));
          const trending = uniqueById(applyShelfRules(trendingRaw));

          let built = [];
          if (mode === "mix") {
            built = buildWeightedMix(
              { popular, trending, topRated },
              MAX_ITEMS
            );
          } else if (mode === "trending") {
            built = trending.slice(0, MAX_ITEMS);
            if (built.length < 10) {
              built = uniqueById([...built, ...popular]).slice(0, MAX_ITEMS);
            }
          } else if (mode === "top_rated") {
            built = topRated.slice(0, MAX_ITEMS);
          } else {
            built = popular.slice(0, MAX_ITEMS);
          }

          // Controlled fill (may fetch extra discover pages, but only if needed)
          built = await fillIfTooSmall(built);
          return built;
        });

        if (cancelled) return;
        setItems(results);
      } catch (err) {
        console.error("BrowseRow fetch error:", err?.response?.status, err);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    requestKey,
    mediaType,
    mode,
    modes,
    includeGenreIds,
    excludeGenreIds,
    allowMixed,
    requireAllInclude,
    certificationCountry,
    certificationLte,
    effectiveMinVotes,
    originalLanguage,
    keywordQuery,
    hasShelf,
  ]);

  const scrollByAmount = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    // Update arrows when items load / layout changes
    const raf = requestAnimationFrame(updateScrollButtons);
    const t1 = setTimeout(updateScrollButtons, 150);

    const el = rowRef.current;
    if (!el)
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
      };

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateScrollButtons());
      ro.observe(el);
    }

    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", updateScrollButtons);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      ro?.disconnect?.();
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items.length]);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-6">
      {/* Row header */}
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white text-lg sm:text-xl font-semibold">
            {title}
          </h3>
          {isLoading && <span className="text-xs text-white/50">Loading…</span>}
          {hasError && (
            <span className="text-xs text-white/50">Couldn’t load.</span>
          )}
        </div>

        <button
          type="button"
          className="text-xs sm:text-sm text-cine-muted hover:text-white transition-colors"
          onClick={() =>
            console.log("Browse more:", { mediaType, includeGenreIds })
          }
        >
          Browse more →
        </button>
      </div>

      {/* Arrows */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 sm:h-20 sm:w-11 md:h-24 md:w-12 items-center justify-center rounded-none rounded-r-2xl bg-cine-highlight/75 hover:bg-cine-highlight/90 text-white/90 hover:text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll left"
        >
          <span className="text-2xl sm:text-3xl leading-none font-black">
            ‹
          </span>
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 sm:h-20 sm:w-11 md:h-24 md:w-12 items-center justify-center rounded-none rounded-l-2xl bg-cine-scope/75 hover:bg-cine-scope/90 text-white/90 hover:text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-highlight/60"
          aria-label="Scroll right"
        >
          <span className="text-2xl sm:text-3xl leading-none font-black">
            ›
          </span>
        </button>
      )}

      {/* Scroll strip */}
      <div
        ref={rowRef}
        className="relative flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-4 scroll-px-4"
      >
        {items.map((item) => (
          <TitleCard key={item.id} item={item} mediaType={mediaType} />
        ))}
        <div aria-hidden className="shrink-0 w-10 sm:w-12 md:w-16" />
      </div>
    </section>
  );
};

export default BrowseRow;
