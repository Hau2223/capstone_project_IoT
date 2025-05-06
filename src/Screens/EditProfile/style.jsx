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
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  body: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    gap: 15,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  contentWrapper: {
    // paddingHorizontal: 20,
    gap: 5,
  },
  inputGroup: {
    gap: 10,
  },
  input: {
    height: 45,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    color: colors.black,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 5,
  },
  picker: {
    height: 45,
    color: colors.black,
  },
  btnSave: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  txtSave: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  cameraIcon: {
    ...light.cameraIcon,
    backgroundColor: colors.bg_dark,
  },
  label: {
    ...light.label,
    color: colors.white,
  },
  pickerWrapper: {
    ...light.pickerWrapper,
    borderColor: colors.white,
    backgroundColor: colors.bg_dark,
  },
  input: {
    backgroundColor: colors.bg_dark,
    color: colors.white,
  },
  picker: {
    ...light.picker,
    color: colors.white,
  },
  label: {
    ...light.label,
    color: colors.white,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
