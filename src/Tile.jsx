// import './Tile.css'


function Tile({active, tile, handleClick, children}) {

  // When the tile gets clicked, it'll pass its object/index to the parent
  // through handle click
  const handleTileClick = () => {
    handleClick(tile);
  }
  
  return (
    // Conditionally rendering the '.active' class allows us to conditionally apply
    // stylings
    <div className={`tile ${ active ? 'active' : ''}`} onClick={handleTileClick}>
      {children}
    </div>
  )
}
  
export default Tile;
