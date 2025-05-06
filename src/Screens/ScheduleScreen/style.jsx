import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';
const screenWidth = Dimensions.get('window').width;
const itemSpacing = 15;
const itemWidth = screenWidth - itemSpacing * 2;

const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: itemSpacing,
  },
  itemColumn: {
    width: '100%',
  },
  itemWrapper: {
    marginBottom: itemSpacing,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: colors.bg_ic,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  itemCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
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
    color: '#666',
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark,
  },
  textHeader: {
    ...light.textHeader,
    color: colors.white,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
