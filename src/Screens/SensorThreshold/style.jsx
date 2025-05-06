import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';
const screenWidth = Dimensions.get('window').width;
const itemSpacing = 10;
const itemWidth = screenWidth - itemSpacing * 2;

const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: itemSpacing,
  },
  listContainer: {
    marginTop: 15,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: itemSpacing,
    borderWidth: 1.5,
    borderColor: colors.bg_NaN,
    padding: 15,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  idEsp: {
    fontSize: 14,
    color: colors.black,
  },
  sliderContainer: {
    marginTop: 15,
    alignItems: 'center',

  },
  sliderLabel: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },
  track: {
    height: 5,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  selectedTrack: {
    backgroundColor: colors.primary,
  },
  marker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.btn_saveDisabled,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark
  },
  itemContainer: {
    ...light.itemContainer,
    backgroundColor: colors.bg_dark,

    borderColor: colors.white,
  },
  name: {
    ...light.name,
    color: colors.white,
  },
  idEsp: {
    ...light.idEsp,
    color: colors.white,
  },
  sliderLabel:{
    ...light.sliderLabel,
    color: colors.white,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
