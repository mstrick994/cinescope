import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";
import Logo from "./components/Hero/Logo.jsx";
import Search from "./components/Search.jsx";
import TopRow from "./components/Hero/TopRow.jsx";
import { getTrending } from "./API/tmdb";
import Hero from "./components/Hero/Hero.jsx";
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trending, setTrending] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);


  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const data = await getTrending();
        
        setTrending(data);
      } catch (err) { 
        console.error("Error loading trending", err);
      }
    } 
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
        <div className="wrapper pt-0">
        <Header />
         <Logo />
        <Search 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        />
        <Hero movie={heroMovie}>
  <TopRow trending={trending} onChangeHero={setHeroMovie} />
</Hero>
      </div>
    </main>
  );
};

export default App;
