import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import colors from '../../assets/common/colorCss';
import {fonts} from '../../assets/common/fontCss';

const light = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textTitle: {
    color: colors.textInputMainLight,
    fontSize: fonts.FontSize.Medium_Y, fontWeight: "bold"
  },
  btnsetting: {
    flexDirection: 'row',
    backgroundColor: colors.textInputMainLight,
    height: scale(45),
    width: '90%',
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
  },
  textMode: {
    color: colors.textInputMainLight,
    fontSize: fonts.FontSize.Medium,
    fontWeight: '700',
  },
  switch: {
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  radioButton: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const dark = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backforDark,
    alignItems: 'center',
  },
  textTitle: {
    color: colors.backforMain,
    fontSize: fonts.FontSize.Medium_Y, fontWeight: "bold"
  },
  btnsetting: {
    flexDirection: 'row',
    backgroundColor: colors.textInputMainDark,
    height: scale(45),
    width: '90%',
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
  },
  textMode: {
    color: colors.textDef,
    fontSize: fonts.FontSize.Medium,
    fontWeight: '700',
  },
  switch: {
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  radioButton: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};