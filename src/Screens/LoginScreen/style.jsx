import {StyleSheet} from 'react-native';

const light = StyleSheet.create({});
const dark = StyleSheet.create({});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
