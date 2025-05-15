import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  layoutImg: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bgImg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imgProfile: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: 'white',
  },
  txtInfo: {
    width: '70%',
  },
  txtWelcome: {
    fontSize: 17,
    color: colors.white,
  },
  txtName: {
    fontWeight: '800',
    maxWidth: '100%',
  },
  layoutContent: {
    backgroundColor: colors.primary,
    width: '95%',

    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  layoutBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  editbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  rowItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    width: '45%',
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  value: {
    width: '55%',
    maxWidth: '55%',
    fontSize: 16,
    color: colors.white,
    flexShrink: 1,
    textAlign: 'right',
    fontWeight: '400',
  },
  labelGarden: {
    width: '80%',
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    maxWidth: '60%',
  },
  valueGarden: {
    width: '20%',
    fontSize: 16,
    color: colors.white,
    flexShrink: 1,
    textAlign: 'right',
    fontWeight: '400',
    maxWidth: '60%',
  },
  versionContainer: {
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    width: '100%',
    textAlign: 'center',
    color: colors.black,
    fontSize: 13,
    fontWeight: '400',
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  versionText: {
    ...light.versionText,
    color: colors.white,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
