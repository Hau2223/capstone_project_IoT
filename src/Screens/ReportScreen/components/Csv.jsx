import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Papa from 'papaparse';

const data = [
  { name: 'John Doe', age: 28, city: 'New York' },
  { name: 'Jane Smith', age: 34, city: 'Los Angeles' },
  { name: 'Sam Green', age: 22, city: 'Chicago' }
];

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to save CSV files.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const generateCSV = async () => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Storage permission is required to save CSV files.');
    return;
  }
  try {
    const csv = Papa.unparse(data);
    const path = RNFS.DownloadDirectoryPath + '/data.csv';
    await RNFS.writeFile(path, csv, 'utf8');
    Alert.alert('CSV Generated', 'File saved at: ' + path);
    return path;
  } catch (error) {
    console.error('Error generating CSV:', error);
    Alert.alert('Error', 'Failed to generate CSV');
  }
};

const shareCSV = async () => {
  try {
    const path = await generateCSV();
    if (path) {
      await Share.open({ url: 'file://' + path });
    }
  } catch (error) {
    console.error('Error sharing CSV:', error);
    Alert.alert('Error', 'Failed to share CSV');
  }
};

const GenerateCSVFromJSON = () => {
  return (
    <View style={styles.container}>
      <Button title="Generate and Share CSV" onPress={shareCSV} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
});

export default GenerateCSVFromJSON;
