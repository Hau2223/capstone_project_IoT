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
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  txtTitleCurrent: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  currentLan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
  },
  txtCurrent: {
    color: colors.black,
    fontWeight: '500'
  },
  txtFlapCurrent: {
    fontSize: 24,
  },
  txtLanCurrent: {
    fontSize: 20,
  },
  txtChooseLan: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '500',
  },
  layoutChooseLan: {
    gap: 5,
  },
  text: {
    color: colors.black,
    fontSize: 24,
    textAlign: 'center',
  },
  ctnmain: {
    gap: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  bodyLan: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  languageFlap: {
    fontSize: 24,
    color: 'white',
    marginLeft: 5,
  },
  languageText: {
    fontSize: 18,
    color: 'white',
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  txtTitleCurrent: {
    ...light.txtTitleCurrent,
    color: colors.white,
  },
  txtCurrent: {
    ...light.txtCurrent,
    color: colors.white,
  },
  txtChooseLan: {
    ...light.txtChooseLan,
    color: colors.white,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
