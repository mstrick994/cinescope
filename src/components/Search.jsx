

const search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
      <div>
        {/* Magnifying Glass Icon */}
        <img
          src="/icons/search.svg"   // <-- Put your SVG in public/icons/search.svg
          alt="Search"
          className="pointer-events-none"
        />

        <input type="text" 
        placeholder='Browse movies'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
    </div>
  )
}

export default search