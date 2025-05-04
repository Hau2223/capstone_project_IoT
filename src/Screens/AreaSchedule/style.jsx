import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const dark = StyleSheet.create({
container: {
    ...light.container,
    backgroundColor: colors.bg_dark
}
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
