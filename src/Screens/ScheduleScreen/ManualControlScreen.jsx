import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const ManualControlScreen = ({ navigation }) => {
  const handleControlPress = (controlType) => {
    // Placeholder for manual control logic
    console.log(`Manual control for ${controlType} pressed`);
    // You can navigate to another screen or perform an action
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Điều khiển thủ công</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleControlPress('water')}
        >
          <Text style={styles.buttonText}>Bật/Tắt Tưới Nước</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleControlPress('light')}
        >
          <Text style={styles.buttonText}>Bật/Tắt Đèn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleControlPress('wind')}
        >
          <Text style={styles.buttonText}>Bật/Tắt Quạt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManualControlScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    height: 70,
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
  },
  textHeader: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});