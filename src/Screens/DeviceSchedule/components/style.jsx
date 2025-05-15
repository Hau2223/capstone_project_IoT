import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../../assets/common/colorCss';

const light = StyleSheet.create({
  item: {
    width: '95%',
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bg_SwitchInAC,
    margin:5,
    borderRadius: 12,
  },
  imgStyle: {
    width: 105,
    height: 105,
    borderRadius: 5,
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    gap: 10,
    marginLeft: 5,
  },
  header2: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textStyle: {
    color: colors.bg_InActopTab,
    fontWeight: '400',
    fontSize: 14,
  },
  FrameShowSchedule: {
    width: '70%',
  },
  btn: {
    width: '25%',
    maxWidth: '25%',
    padding: 5,
    backgroundColor: colors.bg_clock,
    borderRadius: 12,
    justifyContent: 'center',
  },
  textBtn: {

    textAlign: 'center',
    fontSize: 8,
    color: colors.black,
  },
  moreText: {
    width: '20%',
    fontSize: 15,
    color: colors.bg_InActopTab,
    alignSelf: 'center',
  },
  noScheduleText: {
    fontSize: 14,
    color: colors.bg_InActopTab,
    fontStyle: 'italic',
  },
});

const dark = StyleSheet.create({
  ...light,
  item: {
    ...light.item,
    backgroundColor: colors.bg_dark,
  },
  header2: {
    ...light.header2,
    color: colors.txtSchedule,
  },
  textStyle: {
    ...light.textStyle,
    color: colors.txtSchedule,
  },
  textBtn: {
    ...light.textBtn,
    color: colors.black,
  },
  moreText: {
    ...light.moreText,
    color: colors.txtSchedule,
  },
  noScheduleText: {
    ...light.noScheduleText,
    color: colors.txtSchedule,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
