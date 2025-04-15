import {StyleSheet} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  //ComfirmEmail
  ceContainer: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ceFormLogin: {
    width: '80%',
    borderRadius: 39,
    alignItems: 'center',
    gap: 30,
  },
  ceImg: {
    width: 120,
    height: 120,
  },
  ceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  ceSubText: {
    width: '70%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  ceInputLayout: {
    width: '90%',
    alignItems: 'center',
  },
  ceFormLabel: {
    color: colors.white,
    fontSize: 16,
  },
  ceTextInput: {
    width: '100%',
    fontStyle: 'italic',
    fontWeight: '500',

    textDecorationStyle: 'solid',
    fontSize: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  ceButton: {
    width: '100%',
    padding: 15,
    backgroundColor: colors.loginBtn,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  ceButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  //VerifyOTP
  vrContainer: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: colors.background,
  },
  vrImg: {
    width: 120,
    height: 120,
  },
  vrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  vrSubText: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  vrForm: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
    gap: 20,
  },
  vrNoticeText: {
    color: colors.white,
    fontSize: 15,
    textAlign: 'center',
  },
  vrResendText: {
    textAlign: 'center',
    color: colors.reSendOTP,
    fontWeight: 'bold',
  },
  vrButton: {
    width: '90%',
    padding: 12,
    backgroundColor: colors.loginBtn,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vrButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  //NewPassword
  cnpContainer: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cnpTitle: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    maxWidth: '70%',

  },
  cnpForm: {
    width: '80%',
    backgroundColor: colors.loginform,
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 20
  },
  cnpHeading: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  cnpFormInner: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  cnpInputGroup: {
    width: '90%',
    gap: 5,
  },
  cnpInputWrapper: {
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  cnpTextInput: {
    maxWidth: '90%',
  },
  cnpErrorText: {
    color: 'red',
    fontSize: 13,
    paddingHorizontal: 10,
  },
  cnpButton: {
    width: '80%',
    height: 40,
    backgroundColor: colors.loginBtn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  cnpButtonText: {
    color: colors.white,
    fontSize: 17,
  },
});
const dark = StyleSheet.create({
  ...light,
  container: {
    ...light.container
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
