import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';


const light = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 70,
    width: '100%',
    marginTop: 20,
  },
  header1: {
    height: 70,
    width: '100%',
    justifyContent: 'center',
  },
  textHeader: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'column',
    marginBottom: 180,
  },
  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  listContainer: {
    gap: 5,
  },

  
});

const dark = StyleSheet.create({
  ...light,
  content: {
    ...light.content,
    backgroundColor: colors.bg_dark,
  }
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
