import {StyleSheet} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  statusBG: {
    color: colors.primary,
  },
  imgLogo: {
    height: 120, 
    width: 120,
  },
  formLogin: {
    width: '80%',
    backgroundColor: colors.loginform,
    borderRadius: 30,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    maxWidth: '70%',
    textAlign: 'center',
    marginBottom: 20,
  },
  login: {
    marginVertical: 20,
    width: '80%',
    backgroundColor: colors.loginform,
    gap: 18,
  },
  txtLogin: {
    fontSize: 26,
    color: colors.loginTit,
    fontWeight: 'bold',
  },
  txtForget: {
    fontStyle: 'italic',
    color: colors.txtForget,
    alignSelf: 'flex-start',
  },
  edtInput: {
    width: '100%',
    height: 36,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  txtInput: {
    maxWidth: '90%',
  },
  iconPass: {
    flexDirection: 'row',
    gap: 6,
  },

  layoutbtn: {
    width: '100%',
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnLogin: {
    width: '80%',
    height: 36,
    backgroundColor: colors.loginBtn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  txtBtn: {
    color: colors.loginform,
    fontSize: 18,
  },
  btnGoogle: {
    width: '80%',
    height: 36,
    backgroundColor: colors.loginbtnGG,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  txtGoogle: {
    color: colors.loginform,
    fontSize: 18,
  },
  wrapperManual: {
    justifyContent: 'center',
  },
  textManual: {
    textAlign: 'center',
    color: colors.txtLoginWith,
    fontSize: 14,
  },

  txtAccNaN: {
    fontSize: 13,
    color: colors.black,
  },
  txtRegister: {
    color: colors.txtForget,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tinyLogo: {
    resizeMode: 'cover', width: 50, height: 50
  },
});
const dark = StyleSheet.create({
 ...light
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
