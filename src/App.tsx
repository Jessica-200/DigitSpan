import React from 'react';
import {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import TutorialPage from './TutorialPage';
import DigitSpan from './DigitSpan';

// Main App control: Tutorial Page -> Play game
const App = () => {
  // Keep track if first Tutorial is to be showed
  const [showTutorial, setShowTutorial] = useState(true);

  // When next clicked, don't show tutorial anymore & switch to game
  const nextClicked = () => {
    setShowTutorial(false);
  }

  // Either show the TutorialPage, or start game when 'Next' clicked
  return (
    <View style={styles.mainContainer}>
      {showTutorial ? (<TutorialPage onNext={nextClicked} />) : 
        (<DigitSpan />)}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
