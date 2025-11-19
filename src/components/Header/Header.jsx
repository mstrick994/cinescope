import Directory from "./Directory.jsx";
import Auth from "./Auth.jsx";


const Header = () => {
  return (
    <header className="flex align-middle mt-1 justify-between items-center">
     <Directory />
      <Auth />
    </header>
   
  )
}

export default Header