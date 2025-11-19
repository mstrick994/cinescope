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
}