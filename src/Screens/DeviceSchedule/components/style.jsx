import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../../assets/common/colorCss';

const light = StyleSheet.create({
  item: {
    width: '100%',
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
  },
  imgStyle: {
    width: 105,
    height: 105,
    borderRadius: 5,
  },
  content: {
    width: 'auto',
    justifyContent: 'center',
    gap: 10,
  },
  header2: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textStyle: {
    color: colors.bg_InActopTab,
    fontSize: 15,
  },
  FrameShowSchedule: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  btn: {
    height: 25,
    width: 'auto',
    backgroundColor: colors.bg_clock,
    borderRadius: 12,
    justifyContent: 'center',
  },
  textBtn: {
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 12,
  },
  moreText: {
    fontSize: 20,
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
