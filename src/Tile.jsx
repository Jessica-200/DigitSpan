import { TouchableOpacity, StyleSheet, Image, View } from "react-native";

function Tile({active, backwards, tile, handleClick}) {

  // When the tile gets clicked, it'll pass its object/index to the parent
  // through handle click
  const handleTileClick = () => {
    handleClick(tile);
  }
  
  return (
    // Conditionally rendering the '.active' class allows us to conditionally apply
    // stylings
    <View style={{width: 100, height: 100}}>
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
    width: 90,
    height: 90,
    width: 90,
    height: 90,
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