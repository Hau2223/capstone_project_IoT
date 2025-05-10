import React from 'react';
import { View, Button, Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';

const requestStoragePermission = async () => {
  console.log(Platform.OS);

  if (Platform.OS === 'android') {
    try {
      if (Platform.Version < 30) {
        // Only request for Android 10 or lower
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app requires storage permissions to download the CSV file.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Denied',
            'Please enable storage permissions manually in the app settings.'
          );
          return false;
        }
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // No permission needed for DownloadDirectoryPath in Android 11+
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }

  return true; // iOS doesn't require explicit storage permissions
};

const jsonToCSV = (jsonData) => {
  const headers = Object.keys(jsonData[0]);
  const escapeField = (field) => {
    if (typeof field === 'string' && field.includes(',')) {
      return `"${field}"`; // Quote fields with commas (if any remain)
    }
    return field;
  };

  const csvRows = [
    headers.join(','), // Header row
    ...jsonData.map(row => headers.map(header => escapeField(row[header])).join(','))
  ];
  return csvRows.join('\n');
};

const downloadCSV = async (datajs) => {
  const isPermissionGranted = await requestStoragePermission();

  if (!isPermissionGranted) {
    Alert.alert('Permission Denied', 'Storage permission is required to download the CSV file.');
    return;
  }

  if (!Array.isArray(datajs) || datajs.length === 0) {
    Alert.alert('Invalid Data', 'No valid data provided for CSV generation.');
    return;
  }

  console.log('Input data:', datajs);

  // Fields to transform (array to underscore-separated string)
  const fieldsToTransform = [
    'moisture_avg',
    'luminosity_avg',
    'tempurature_avg', 
    'humidity_avg',
    'stream_avg'
  ];

  // Transform array fields to underscore-separated strings
  const transformedData = datajs.map(row => {
    const newRow = { ...row };
    fieldsToTransform.forEach(field => {
      if (newRow[field] && Array.isArray(newRow[field])) {
        newRow[field] = newRow[field].length > 0 ? newRow[field].join('_') : '';
      }
    });
    return newRow;
  });

  console.log('Transformed data:', transformedData);

  // Convert to CSV
  const csvData = jsonToCSV(transformedData);
  console.log('CSV Content:', csvData);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `report-data-${timestamp}.csv`;
  const path =
    Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${fileName}`
      : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    await RNFS.writeFile(path, csvData, 'utf8');
    console.log('File saved to:', path);
    Alert.alert('Download Successful', `File saved to ${path}`);
  } catch (err) {
    console.error('File write error:', err.message);
    let errorMessage = 'Error saving the CSV file.';
    if (err.code === 'EUNSPECIFIED') {
      errorMessage = 'Storage access was denied or unavailable.';
    } else if (err.code === 'ENOENT') {
      errorMessage = 'The file path is invalid or inaccessible.';
    }
    Alert.alert('Download Failed', errorMessage);
  }
};

export function DownloadCSV({ datajs }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Download CSV" onPress={() => downloadCSV(datajs)} />
    </View>
  );
}