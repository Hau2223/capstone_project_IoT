import {StyleSheet} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  header1: {
    width: '80%',
    justifyContent: 'center',
  },
  textHeader: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  header2: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  itemWrapper: {
    alignItems: 'center',
    width: '50%',
    overflow: 'hidden',
    padding: 5,
  },
  listContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    overflow: 'hidden',
  },
  listSkeleton: {
    gap: 10,
    marginHorizontal: 10,
  },
  columnSkeleton: {
    gap: 10,
  },
  itemSkeleton: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  contentSkeleton: {
    gap: 5,
  },
  floatingButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 10,
    right: 10,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.bg_modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',

    gap: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.black,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: colors.btn_Cancel,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '900',
  },
  item: {
    width: '100%',
    backgroundColor: colors.white,
    flexDirection: 'column',
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    elevation: 5,
    shadowColor: colors.black,
  },
  imgStyle: {
    width: '100%',
    height: 130,
  },
  content: {
    width: '95%',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerCompo: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'justify',
  },
  txtGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
  },
});

const dark = StyleSheet.create({
  ...light,
  frame: {
    ...light.frame,
    backgroundColor: colors.bg_dark,
  },
  container: {
    ...light.container,
    backgroundColor: colors.bg_dark, 
  },
  modalContainer: {
    ...light.modalContainer,
    backgroundColor: colors.bg_dark,
  },
  modalTitle: {
    ...light.modalTitle,
    color: colors.white,
  },
  modalInput: {
    ...light.modalInput,
    borderColor: colors.white,
    color: colors.white,
  },
  item: {
    ...light.item,
    backgroundColor: colors.bg_dark,
    borderColor: colors.white,
  },
  imgStyle: {
    ...light.imgStyle,
    borderColor: colors.white,
  },
  textStyle: {
    ...light.textStyle,
    color: colors.white,
  },
  itemSkeleton: {
    ...light.itemSkeleton,
    backgroundColor: colors.bg_dark,
  },
  emptyText: {
    ...light.emptyText,
    color: colors.lightGray,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
