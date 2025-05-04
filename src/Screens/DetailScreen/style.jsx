import { StyleSheet } from 'react-native';
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
    paddingTop: 5,
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
    alignItems: 'center',
  },
  header2: {
    maxWidth: '75%',
    color: colors.primary,
    fontWeight: 'bold',
    backgroundColor: colors.white,
    borderTopRightRadius: 5,
    padding: 5,
  },
  headerButton: {
    maxWidth: '25%',
    flexDirection: 'row',
    backgroundColor: colors.white,
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
    fontSize: 17,
  },
  containerFrame: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.borderColor,
    padding: 10,
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
  },
  UserFrame: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  iconContent: {
    width: '15%',
    justifyContent: 'center',
  },
  textContent: {
    width: '65%',
    justifyContent: 'center',
  },
  valueContent: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textUser: {
    width: '55%',
    justifyContent: 'center',
  },
  textRole: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // Giảm chiều rộng để giống hình ảnh
    backgroundColor: colors.white,
    borderRadius: 15, // Bo góc nhiều hơn
    padding: 20,
    alignItems: 'center',
    gap: 15,
    elevation: 5, // Thêm bóng cho modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18, // Giảm kích thước chữ để phù hợp với hình ảnh
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8, // Giảm padding để nhỏ gọn hơn
    fontSize: 16,
    color: colors.black,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15, // Tăng khoảng cách giữa các nút
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#28A745', // Màu xanh lá giống trong hình
    paddingVertical: 12,
    borderRadius: 8, // Bo góc nhiều hơn
    alignItems: 'center',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#F5A623', // Màu cam giống trong hình
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold', // Chữ đậm hơn
  },

  menuContainer: {
    width: '100%',
    marginVertical: 10,
  },
  menuAnchor: {
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
    fontSize: 16,
    color: colors.black,
  },
  menuIcon: {
    marginLeft: 10,
  },
  selectedUserText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
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
  header2: {
    ...light.header2,
    backgroundColor: colors.bg_dark,
  },
  headerButton: {
    ...light.headerButton,
    backgroundColor: colors.bg_dark,
  },
  textStyle: {
    ...light.textStyle,
    color: colors.white,
  },
  containerFrame: {
    ...light.containerFrame,
    borderColor: colors.white,
    backgroundColor: colors.bg_dark,
  },
  textHeader3: {
    ...light.textHeader3,
    color: colors.white
  },
  noMembersText: {
    ...light.noMembersText,
    color: colors.white,
  },

  // Modal
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
  },
  menuItem: {
    ...light.menuItem,
    borderBottomColor: '#444',
  },
  menuItemText: {
    ...light.menuItemText,
    color: colors.white,
  },
  noMembersText: {
    ...light.noMembersText,
    color: colors.white,
  },
  menuAnchor: {
    ...light.menuAnchor,
    backgroundColor: colors.bg_dark,
  },
  menuAnchorText: {
    ...light.menuAnchorText,
    color: colors.white
  },
  flatList: {
    ...light.flatList,
    backgroundColor: colors.bg_dark,
  },
  menuItemText: {
    ...light.menuItemText,
    color: colors.white,
  },

});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};