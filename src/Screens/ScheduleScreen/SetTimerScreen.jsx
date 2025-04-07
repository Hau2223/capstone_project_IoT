import {TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const SetTimerScreen = () => {
  return (
    <View>
      <Text>SetTimerScreen</Text>
      <TouchableOpacity style={styles.button}>
  <Text style={styles.plusIcon}>+</Text>
</TouchableOpacity>
    </View>
  );
};

export default SetTimerScreen;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#1B3278',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  plusIcon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});