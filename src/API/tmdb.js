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
