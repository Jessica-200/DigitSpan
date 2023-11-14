// TutorialPage to display instructions & visual example
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// onNext is a prop being passed between this TutorialPage & App
// so when 'Next' button is clicked it'll change to DigitSpan
const TutorialPage = ({ onNext }) => {
  return (
    <View style={styles.tutorialContainer}>
      <View style={styles.taskHeader}>
        <Text style={styles.headerText}>Digit Span Task</Text>
      </View>

      <View style={styles.stepsText}>
        <Text>Write out game steps here</Text>
      </View>

      <Button style={styles.nextButton} title="Next" onPress={onNext}></Button>

    </View>
  );
};

const styles = StyleSheet.create( {
  tutorialContainer: {
    flex: 1,
  },
  taskHeader: {
    padding: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepsText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  nextButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});

export default TutorialPage;
