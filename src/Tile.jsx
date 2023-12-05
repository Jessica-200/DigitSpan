import { TouchableOpacity, StyleSheet, Image, View, Dimensions } from "react-native";

export const gridSize = 3;
const tileSize = Math.ceil((Dimensions.get('window').height/(gridSize*2)));
const spacing = Math.ceil((Dimensions.get('window').width/(gridSize)));

function Tile({active, backwards, tile, handleClick}) {

  // When the tile gets clicked, it'll pass its object/index to the parent
  // through handle click
  const handleTileClick = () => {
    handleClick(tile);
  }
  
  return (
    // Conditionally rendering the '.active' class allows us to conditionally apply
    // stylings
    <View style={{width: spacing, height: spacing, alignItems: 'center'}}>
      <TouchableOpacity style={[styles.tile(backwards), active && styles.activeTile]}
        onPress={handleTileClick}>
        {<Image source={require('./assets/logo-200.png')} style={styles.tileImg}/> }
      </TouchableOpacity>
    </View>
    
  );
}

const forwardsColor = '#16309A';
const backwardsColor = '#C04000';
const activeColor = '#EAC117';
const styles = StyleSheet.create({
  tile: backwards => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: !backwards ? forwardsColor : backwardsColor,
    width: tileSize,
    height: tileSize,
    width: tileSize,
    height: tileSize,
    borderRadius: 12,
  }),
  activeTile: {
    backgroundColor: activeColor,

    // Box shadow for Android devices
    elevation: 5,

    // Theoretically this should create a color box shadow on Apple devices,
    // but I do not have an apple device to confirm
    shadowColor: activeColor,
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  tileImg: {
    objectFit: 'contain',
    width: '80%',
    height: '80%',
  },
});
  
export default Tile;