import {StyleSheet} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  container1: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
    paddingTop: 6,
    paddingHorizontal: 10,
    gap: 5,
  },
  img: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  imgStyle: {
    height: 265,
    borderRadius: 5,
  },
  cameraIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: colors.white,
  },
  icCamera: {
    color: colors.white,
    fontSize: 25,
    padding: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  loNameId: {
    maxWidth: '75%',
    borderTopRightRadius: 5,
  },
  header2: {
    color: colors.black,
    fontWeight: 'bold',
  },
  toggleButton: {
    color: colors.loginTxt,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerButton: {
    maxWidth: '25%',
    flexDirection: 'row',
    padding: 5,
    gap: 5,
  },
  btnChange: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 5,
    padding: 5,
  },
  ScrollView: {
    width: '95%',
    gap: 10,
  },
  textStyle: {
    color: colors.black,
    fontSize: 16,
  },
  textValue: {
    color: colors.black,
    fontSize: 17,
    textAlign: 'right',
    fontWeight: '400',
    width: '100%',
  },
  containerFrame: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.borderColor,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 10,
    backgroundColor: colors.white,
  },
  textHeader3: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentFrame: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  UserFrame: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  noBorderBottom: {
    borderBottomWidth: 0,
  },
  textContent: {
    width: '60%',
    justifyContent: 'center',
  },
  valueContent: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  controlSettingsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconContent: {
    width: '15%',
  },
  textUser: {
    width: '75%',
  },
  layout_role: {
    width: '10%',
  },
  noMembersText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 20,
    marginTop: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loTitle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    width: 'auto',
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
  btnCloseBlock: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '900',
  },
  // Custom Dropdown Styles
  controlMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: colors.white,
    minWidth: 140,
    maxWidth: 140,
  },
  menuContainer: {
    width: '100%',
  },
  menuAnchor: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  menuAnchorText: {
    width: '80%',
    fontSize: 14,
    color: colors.black,
  },
  menuIcon: {
    marginLeft: 10,
    fontSize: 26,
    color: colors.primary,
  },
  selectedUserText: {
    width: '100%',
    fontSize: 14,
    color: colors.primary,
    backgroundColor: 'red',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  flatList: {
    maxHeight: 150,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 5,
  },
  menuItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.black,
  },
  noMembersText: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  detailBlock: {
    backgroundColor: colors.primary,
    padding: 5,
    alignSelf: 'flex-end',
  },
  layoutBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
    padding: 5,
    gap: 10,
  },
  imgBlock: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  lotxtBlock: {
    width: '70%',
  },
  controlMenuIcon: {
    color: colors.primary,
  },
});

const dark = StyleSheet.create({
  ...light,
  frame: {
    ...light.frame,
    backgroundColor: colors.bg_dark,
  },
  container1: {
    ...light.container1,
    backgroundColor: colors.bg_dark,
  },
  titleContainer: {
    ...light.titleContainer,
    backgroundColor: colors.bg_dark,
  },
  header2: {
    ...light.header2,
    color: colors.white,
  },
  toggleButton: {
    ...light.toggleButton,
    color: colors.white,
  },
  headerButton: {
    ...light.headerButton,
    backgroundColor: colors.bg_dark,
  },

  textStyle: {
    ...light.textStyle,
    color: colors.white,
  },
  textValue: {
    ...light.textValue,
    color: colors.white,
  },
  containerFrame: {
    ...light.containerFrame,
    borderColor: colors.white,
    backgroundColor: colors.bg_dark,
  },
  textHeader3: {
    ...light.textHeader3,
    color: colors.white,
  },
  noMembersText: {
    ...light.noMembersText,
    color: colors.white,
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
    color: colors.white,
    borderColor: colors.white,
  },
  modalButtonPrimary: {
    ...light.modalButtonPrimary,
    backgroundColor: '#28A745',
  },
  modalButtonCancel: {
    ...light.modalButtonCancel,
    backgroundColor: '#F5A623',
  },

  controlMenuButton: {
    ...light.controlMenuButton,
    backgroundColor: colors.bg_dark,
    borderColor: colors.white,
  },
  menuContainer: {
    backgroundColor: colors.bg_dark,
  },
  menuAnchor: {
    ...light.menuAnchor,
    backgroundColor: colors.bg_dark,
    borderColor: colors.white,
  },
  menuAnchorText: {
    ...light.menuAnchorText,
    color: colors.white,
  },
  selectedUserText: {
    ...light.menuAnchorText,
    color: colors.white,
  },
  menuIcon: {
    ...light.menuIcon,
    color: colors.white,
  },
  controlMenuIcon: {
    ...light.controlMenuIcon,
    color: colors.white,
  },
  flatList: {
    ...light.flatList,
    backgroundColor: colors.bg_dark,
    borderColor: colors.white,
  },
  menuItem: {
    ...light.menuItem,
    borderColor: colors.white,
    backgroundColor: colors.bg_dark,
  },
  menuItemText: {
    ...light.menuItemText,
    color: colors.white,
  },
  noMembersText: {
    ...light.noMembersText,
    color: colors.white,
  },
  detailBlock: {
    ...light.detailBlock,
    backgroundColor: colors.primary,
  },
  layoutBlock: {
    ...light.layoutBlock,
    borderColor: colors.white,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
