import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// The actual Game logic, need to move over from demo
const DigitSpan = () => {
    return (
        <View style={styles.digitSpanContainer}>
            <Text>Game Page Plays Here</Text>
            {/* Include game components & logic here */}
        </View>
    );
};

const styles = StyleSheet.create( {
    digitSpanContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DigitSpan;
