import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";

import TopRow from "./components/Hero/TopRow.jsx";
import Hero from "./components/Hero/Hero.jsx";
import  HeroInfo from "./components/Hero/HeroInfo";

import ExploreSection from "./components/Mosaic/ExploreSection.jsx";
import PickAPlan from "./components/Pick A Plan/PickAPlan.jsx";
import BrowseSection from "./components/Browse Categories/BrowseSection.jsx";
import { getTrending } from "./API/tmdb";

const App = () => {
  
  const [trending, setTrending] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const data = await getTrending();
        setTrending(data);
        setHeroMovie(data[0]); // set first hero bg immediately
      } catch (err) { 
        console.error("Error loading trending", err);
      }
    };
    loadTrendingMovies();
  }, []);

  return (
    <main className="relative">
      <Header className="absolute top-0 left-0 w-full z-40" />

        <Hero  movie={heroMovie}>
          <HeroInfo movie={heroMovie} />
        </Hero>
        
    <section className="mt-10 sm:mt-3 md:mt-3 lg:mt-7">
      <TopRow trending={trending} onChangeHero={setHeroMovie} />
    </section>
      
      <ExploreSection />
      <PickAPlan />
      <BrowseSection />

    </main>
  );
};

export default App;
