import { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';

import Tile from './Tile';

const gameRules = {
  size: 2,
  tileDelay: 500,  // Time between tiles lighting up in sequence
  sequenceDelay: 750,  // Time between sequences
};

/**
 * Returns a 1D array of Tiles (key, coordinates, active or not)
 * @param {Number} size Length/height of grid (i.e. 3x3, 4x4, etc.)
 * @returns 
 */
const initTiles = (size) => {
  const tiles = [];
  for ( let i = 0; i < size; i++) {
    for ( let j = 0; j < size; j++) {
      tiles.push( {
        key: i.toString(10) + j.toString(10),
        x: i,
        y: j,
        active: false,
      });
    }
  }
  return tiles;
};

/**
 * Builds a sequence of tiles
 * @param {Number} length Desired size of sequence
 * @param {Number} gridSize Size of digit span grid
 */
const buildSequence = (length, gridSize) => {

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const sequence = [];

  // Unused tiles in the range [0, gridSize)-- we pick random tiles from here
  // to make the sequence as unique as possible
  const unusedTiles = [];
  for ( let i = 0; i < gridSize; i++ ) {
    unusedTiles.push(i);
  }
  
  // Build the sequence by adding (length) amount of tiles to it
  for ( let i = 0; i < length; i++ ) {
    if ( unusedTiles.length != 0 ) {
      // If there are still unused tiles, add a random one to the sequence 
      const nextTileIndex = getRandomInt(unusedTiles.length);
      const nextTile = unusedTiles[ nextTileIndex ];
      sequence.push(nextTile);
  
      // Tile got used, remove it from list of unused tiles
      unusedTiles.splice(nextTileIndex, 1);
    } else {
      // If there were no more unused tiles, just use any random tiles
      const nextTile = getRandomInt(gridSize);
      sequence.push(nextTile);
    }
  }

  return sequence;
}

/**
 * Play the current sequence as long as possible
 * @param {Array} sequence Sequence of tiles to play (represented by index in
 * tiles array)
 */
const playSequence = (sequence, tiles, setTiles) => {

  const activateTile = (sequenceTileIndex) => {
    // We can safely assume that the index is in range [0, sequence.length),
    // so no need to do index range checks
    const tileToPlayIndex = displaySequence[sequenceTileIndex];

    // The tile to play is the one in the sequence we will activate
    // But if it's the terminator, we make the key=-1 so that all tiles
    // get deactivated and the sequence ends
    const tileToPlay = tileToPlayIndex != -1 ? tiles[tileToPlayIndex] : {
      key: '-1',
    }; 
    
    // Since index is safe, we can also just activate the tile

    // Light up the target in the array of tiles and update state to trigger
    // rerender
    const newTiles = tiles.map( (tile) => {
      return tile.key == tileToPlay.key ? 
        {...tile, active: true,} :  // If target, activate it
        {...tile, active: false,};  // Otherwise, unactivate it/ensure it's unactivate
    });
    setTiles(newTiles);
  }
  
  // End the sequence with a *terminator* value:
  // Allows for the last actual tile to be activated and unactivated properly
  const displaySequence = [...sequence, -1];

  console.log(sequence);

  // Using a Promise allows us to await/.then() to wait until the interval 
  // is done playing before moving on
  return new Promise ( (resolve) => { 
    let sequenceTileIndex = 0;

    // Activate the first tile; This is necessary so that it starts w/o delay
    activateTile(sequenceTileIndex);
    
    // Activate the rest of the tiles in the sequence (including terminator)
    const seqInterval = setInterval( () => {

      sequenceTileIndex++;
      activateTile(sequenceTileIndex);

      // If there are no more tiles to activate after this one, move on
      if (sequenceTileIndex + 1 >= displaySequence.length) {
        clearInterval(seqInterval);
        resolve();
      }
    }, gameRules.tileDelay);
  });

}

/**
 * Given two sequences (arrays), check if they hold the same values
 * @param {Array} a 
 * @param {Array} b 
 * @returns Whether or not the arrays match
 */
const sequencesMatch = (a, b) => {
  if (a == null || b == null) {return false;}
  if (a.length != b.length) {return false;}

  for (let i = 0; i < a.length; i++) {
    if ( a[i] !== b[i] ) {
      return false;
    }
  }
  return true;
}

/**
 * Pause execution of statements for a specified amount of time, after the pause 
 * allow execution to start again
 * @param {Number} delay Delay in milliseconds (ms)
 */
const wait = async (delay) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  // Continue with other code here after the delay is over
};

function DigitSpan() {  
  // Level starts at level 2; May need to become state variable later in order
  // to indicate to users what level they are at 
  const level = useRef(2);
  const roundsLeft = useRef(2);  // How many rounds per level a user has left
  const userCanAdvance = useRef(false); // If a user has won at least once per level, they can advance to next level

  const [backwards, setBackwards] = useState(false);

  /*
    Tiles is an array of tiles that each have info on:
      - Coordinates (.x, .y) in the grid
      - Whether it's lit up or not (.active)
  */
  const [tiles, setTiles] = useState(initTiles(gameRules.size));
  const [sequence, setSequence] = useState(  // Current sequence to match to
    buildSequence(level.current, gameRules.size**2)
  );

  // TODO: Remove this; demo purposes only
  const [gameStarted, setGameStarted] = useState(false);
  
  const [userCanClick, setUserCanClick] = useState(false);
  const [userSequence, setUserSequence] = useState([]);

  useEffect( () => { 
    if (gameStarted) {  // Only run if the game has been started

      // Make sure user can't input while sequence plays
      setUserCanClick(false);

      // 
      wait(gameRules.sequenceDelay).then( () => {
        
        // Play the newly built sequence
        playSequence(sequence, tiles, setTiles).then( () => {
          // After the sequence is done, do some other stuff 
          console.log("after sequence");
          
          // Stop game/sequence + allow for user input
          setUserCanClick(true);
          setGameStarted(false);
  
          // At this point, the user is allowed to input the sequence
        })
      })

    }     
  }, [gameStarted]);

  // Compare the user sequence to the actual sequence and returns a boolean
  // indicating if a new round should start or not + updates state accordingly
  const handleRoundOutcome = (userSequence, actualSequence, backwardsFlag) => {
    const sequenceToCompare = !backwardsFlag ? 
      actualSequence :  // If not backwards sequence, just give the sequence
      [...actualSequence].reverse();  // Otherwise reverse it
    
    // If sequences match so far
    if (sequencesMatch(userSequence, sequenceToCompare.slice(0, userSequence.length))) {
      // If user sequence matches given sequence in its entirety
      if (sequencesMatch(userSequence, sequenceToCompare)) {

        // User has succeeded this round, a new round should start
        // + that they can advance for this upcoming level
        roundsLeft.current -= 1;
        userCanAdvance.current = true;
        return true;
      }
      return false;  // If not a full match, new round shouldn't start
    } else {
      // User has lost this round, a new round should start
      roundsLeft.current -= 1;
      return true;
    }
  }

  // Resetting the necessary variables for the start of a new round
  const startNewRound = () => {
    setSequence(buildSequence(level.current, gameRules.size**2));
    setUserSequence([]);
    setUserCanClick(false); 
    setGameStarted(true);
  }

  // Resets all game variables to default-- this may not be necessary in final 
  // version; this just allows us to use the 'Start Game' button to reset the
  // game
  const gameOver = () => {
    setSequence(buildSequence(level.current, gameRules.size**2));
    setUserSequence([]);
    setBackwards(false);
    setUserCanClick(false);
    setGameStarted(false);
  }

  // When the level ends, allow them to advance to the next level (if they won
  // at least one round)
  // OR start the backwards sequence/ end the entire game (if they lost both)
  const handleLevelEnd = () => {
    if (userCanAdvance.current) {
      // User won at least 1 round this level, they can advance to next level 
      console.log("User won at least once, new level");
      level.current += 1;

    } else {
      if (!backwards) {
        // User lost both rounds this level, they have to start the 
        // backwards sequence now (if they weren't on backwards sequence already)
        console.log("Backwards sequence started");
        setBackwards(true);
        level.current = 2;  // Start from level 2 again
      } else {
        // If they were on backwards sequences and lost both rounds,
        // the entire game is over now
        console.log("Game over");
        gameOver();  // Reset game state to default (just in case)
      }
    }

    // Reset state for the next level
    roundsLeft.current = 2;
    userCanAdvance.current = false;
  }

  /* 
    If the user can click, the tiles they have clicked so far (userSequence)
    gets compared to the actual sequence.

    If it matches/doesn't match, the sequences gets reset and no further input
    is allowed
  */
  const handleClick = (userTile) => {

    if (userCanClick) {

      // Update user's sequence based on tile they clicked
      const newUserSequence = [...userSequence, userTile]; 
      setUserSequence(newUserSequence);
      console.log(`user: ${newUserSequence}`);

      // Compare the user sequence to the actual one:
      //    - If full match, new round starts + user is allowed to advance level
      //    - If mistake, new round starts 
      let shouldStartNewRound = handleRoundOutcome(newUserSequence, sequence, 
        backwards);

      // If they ran out of tries for this level, the level has ended
      if (roundsLeft.current == 0) {
        // If the game is fully over, make sure a new round can't start
        if (!userCanAdvance.current && backwards) shouldStartNewRound = false;

        /// When the level ends, allow them to advance to the next level 
        // (if they won at least one round)
        // Otherwise, start the backwards sequence/ end the entire game
        handleLevelEnd();
      }

      // If user input caused them to succeed/fail the round, a new round has
      // to start; Reset state for the new round
      if (shouldStartNewRound) {
        startNewRound();
      }
    }
  }

  return (
    <>
      <View style={styles.tileGrid}>
        {tiles.map((tile, index) => (
          <Tile
            active={tile.active}
            tile={index}
            handleClick={() => handleClick(index)}
            key={tile.key}
          >
            {tile.x}, {tile.y}, {index}
          </Tile>
        ))}
      </View>
      <View style={styles.buttons}>
        <Button title="Start" onPress={() => setGameStarted(true)} />
      </View>
    </>
  );
}


const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },
    roundsLeft: {
        padding: 20,
        alignItems: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tileGrid: {
        justifyContent: 'center',
        gap: 32,
        margin: 32,
    },
    buttons: {
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
    },
});

export default DigitSpan;