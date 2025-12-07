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

// ⭐ NEW: fetch full details for hero section
export const getTitleDetails = async (id, mediaType = "movie") => {
  const type = mediaType === "tv" ? "tv" : "movie";

  const res = await client.get(`/${type}/${id}`);
  return res.data;
};
