import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

function Tile({active, tile, handleClick, children}) {

  // When the tile gets clicked, it'll pass its object/index to the parent
  // through handle click
  const handleTileClick = () => {
    handleClick(tile);
  }
  
  return (
    // Conditionally rendering the '.active' class allows us to conditionally apply
    // stylings
    <View style={{width: 125, height: 125}}>
      <TouchableOpacity style={[styles.tile, active && styles.activeTile]}
      onPress={handleTileClick}>
      <Text>{children}</Text>
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
  
});
  
export default Tile;
