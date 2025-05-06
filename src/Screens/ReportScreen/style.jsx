import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import colors from '../../../assets/common/colorCss';
import {fonts} from '../../../assets/common/fontCss';

const light = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
  },
  header1: {
    width: '80%',
    justifyContent: 'center',
  },
  textHeader: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  frameItem: {
    height: 200,
    width: '100%',
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg_modal,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  icon: {
    marginBottom: 10,
  },
  txtArea: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemWrapper: {
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  listContainer: {
    paddingBottom: 20,
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
    color: colors.bg_InActopTab,
  },
});

const dark = StyleSheet.create({
  ...light,
  frame: {
    ...light.frame,
    backgroundColor: colors.bg_dark,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
