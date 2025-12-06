import Directory from "./Directory.jsx";
import Auth from "./Auth.jsx";
import Logo from "../Hero/Logo.jsx";
import Search from "../Search.jsx"
import { useState } from "react";

const Header = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <header
      className={`grid grid-cols-3 items-center px-5 py-2 h-16 bg-transparent z-20 ${className}`}
    >
      {/* LEFT */}
      <div className="flex justify-start">
        <Directory />
      </div>

      {/* CENTER */}
      <div className="flex justify-center">
        <Logo />
      </div>
            
         

      {/* RIGHT */}
      <div className="flex justify-end whitespace-nowrap gap-1">
        <Search 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
        <Auth />
      </div>
    </header>
  );
};

export default Header;
