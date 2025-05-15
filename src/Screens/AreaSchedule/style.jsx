import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  header1: {
    width: '80%',
    justifyContent: 'center',
  },
  textHeader: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
});

const dark = StyleSheet.create({
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  header: {
    ...light.header,
  },
  header1: {
    ...light.header1,
  },
  textHeader: {
    ...light.textHeader,
    color: colors.white,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
