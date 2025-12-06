

const search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search '>
      <div>
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