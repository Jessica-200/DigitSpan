import { TouchableOpacity, StyleSheet, Image, View } from "react-native";

function Tile({active, tile, handleClick}) {

  // When the tile gets clicked, it'll pass its object/index to the parent
  // through handle click
  const handleTileClick = () => {
    handleClick(tile);
  }
  
  return (
    // Conditionally rendering the '.active' class allows us to conditionally apply
    // stylings
    <View style={{width: 100, height: 100}}>
      <TouchableOpacity style={[styles.tile, active && styles.activeTile]}
        onPress={handleTileClick}>
        {<Image source={require('./assets/logo-200.png')} style={styles.tileImg}/> }
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  tile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#16309a',
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  activeTile: {
    backgroundColor: '#0a1649',
    color: 'white',
    elevation: 8,
  },
  tileImg: {
    objectFit: 'contain',
    width: '80%',
    height: '80%',
  },
});
  
export default Tile;