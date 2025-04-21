import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

const dark = StyleSheet.create({
  ...light,

});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
