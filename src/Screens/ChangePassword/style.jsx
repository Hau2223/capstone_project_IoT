import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  content: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 15,
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  input: {
    height: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  btnSave: {
    alignSelf: 'flex-end',
    marginTop: 15,
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
  content: {
    ...light.content,
    backgroundColor: colors.bg_dark,
  },
  label: {
    ...light.label,
    color: colors.white,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
