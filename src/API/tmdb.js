import axios from "axios";

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export const getTrending = async () => {
  const res = await client.get("/trending/all/week");
  return res.data.results;
};

// NEW: fetch full details + rating info
export const getTitleDetails = async (id, mediaType = "movie") => {
  const isTv = mediaType === "tv";

  const res = await client.get(`/${isTv ? "tv" : "movie"}/${id}`, {
    params: {
      append_to_response: isTv ? "content_ratings" : "release_dates",
    },
  });

  return res.data;
};

/**
 *  Generic helper:
 * Get either poster_path or backdrop_path for a given title.
 *
 * imageType: "poster" | "backdrop"
 * mediaType: "movie" | "tv"
 */
export const getImagePathForTitle = async (
  title,
  mediaType = "movie",
  imageType = "poster"
) => {
  if (!title) return null;

  const searchEndpoint =
    mediaType === "tv" ? "/search/tv" : "/search/movie";

  const res = await client.get(searchEndpoint, {
    params: {
      query: title,
      include_adult: false,
    },
  });

  const results = res.data?.results || [];
  if (!results.length) return null;

  const firstMatch = results[0];

  if (imageType === "poster") {
    return firstMatch.poster_path || null;
  }

  if (imageType === "backdrop") {
    return firstMatch.backdrop_path || null;
  }

  return null;
};

/**
 *  Wrapper for poster images
 */
export const getPosterPathForTitle = (title, mediaType = "movie") => {
  return getImagePathForTitle(title, mediaType, "poster");
};

/**
 * Wrapper for hero-style backdrops
 */
export const getBackdropPathForTitle = (title, mediaType = "movie") => {
  return getImagePathForTitle(title, mediaType, "backdrop");
};
