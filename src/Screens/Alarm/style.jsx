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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header1: {
    flex: 1,
    justifyContent: 'center',
  },
  textHeader: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemAlarm: {
    flex: 1,
    width: '100%',
  },
  frameItem: {
    height: 110,
    width: '95%',
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.bg_SwitchInAC,
  },
  content1: {
    height: 'auto',
    width: '50%',
    flexDirection: 'column',
    gap: 5,
    marginLeft: 10,
  },
  textNumClock: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
  },
  textTimer: {
    height: '50%',
    width: '100%',
  },
  txtNumClock: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: colors.black,
  },
  txtTimer: {
    fontSize: 16,
    fontWeight: '500',
    justifyContent: 'center',
    color: colors.black,
  },
  content2: {
    height: 'auto',
    width: '50%',
    flexDirection: 'row',
  },
  txtLich: {
    height: '100%',
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  btnWatering: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: colors.black,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  txtNumClock: {
    ...light.txtNumClock,
    color: colors.white,
  },
  txtTimer: {
    ...light.txtTimer,
    color: colors.white,
  },
  fab: {
    ...light.fab,
    backgroundColor: colors.primary,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
