import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import colors from '../../../assets/common/colorCss';
import {fonts} from '../../../assets/common/fontCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
});

const dark = StyleSheet.create({
  ...light,
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
