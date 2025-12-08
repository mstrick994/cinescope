// src/components/Header/MobileMenu.jsx
import Directory from "./Directory.jsx";
import Search from "../Search.jsx";

const MobileMenu = ({ isOpen, searchTerm, setSearchTerm }) => {
  return (
    <div
      className={`
        mobile-menu-overlay 
        fixed inset-0 md:hidden z-30
        bg-black/30
        bg-gradient-to-b from-white/10 via-white/5 to-transparent
        backdrop-blur-xl
        transition-all duration-300 origin-top
        ${isOpen
          ? "opacity-100 scale-y-100 pointer-events-auto"
          : "opacity-0 scale-y-90 pointer-events-none"}
      `}
    >
      <div className="h-full w-full px-5 pt-16 pb-4 overflow-y-auto">
        <div className="mt-2 space-y-6">
          <Directory layout="vertical" />

          <div className="w-full pt-1">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
