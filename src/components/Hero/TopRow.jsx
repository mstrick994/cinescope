import { useState, useEffect } from "react";


const TopRow = ({ trending, onChangeHero }) => {
  const movies = trending.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

useEffect(() => {
  if (!trending || trending.length === 0) return;

  const movie = trending[activeIndex];
  if (!movie) return;

  onChangeHero(movie);

}, [activeIndex, trending, onChangeHero]);



  return (
    <section className="trending">
      <h2 className="text-2xl font-bold mb-6">Trending Now</h2>

      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopRow;
