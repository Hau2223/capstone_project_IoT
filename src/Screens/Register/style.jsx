import {StyleSheet} from 'react-native';
import colors from '../../../assets/common/colorCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  //Request
  rqContainer: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },  
  rqImg: {
    height: 120,
    width: 120,
  },
  rqTitle: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    maxWidth: '70%',
    textAlign: 'center',
  },
  rqForm: {
    width: '80%',
    backgroundColor: colors.loginform,
    borderRadius: 30,
    alignItems: 'center',
    paddingBottom: 20,
    gap: 5,
  },
  rqHeading: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: 'bold',
    alignSelf: "flex-start",
    padding: 10
  },
  rqFormInner: {
    width: '80%',
    gap: 15,
  },
  rqInputGroup: {
    gap: 5,
  },
  rqInputWrapper: {
    width: '100%',
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  rqTextInput: {
    maxWidth: '90%',
  },
  rqInputPasswordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  rqErrorText: {
    color: 'red',
    fontSize: 13,
    paddingHorizontal: 5
  },
  rqButtonGroup: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  rqButton: {
    width: '80%',
    height: 40,
    backgroundColor: colors.loginBtn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
  },
  rqButtonText: {
    color: colors.loginform,
    fontSize: 17,
  },
  rqTextLink: {
    fontSize: 13,
    color: colors.black,
  },
  rqTextLogin: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 14,
  },

  //ComfirmEmail
  ceContainer: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ceFormLogin: {
    width: '80%',
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
    fontWeight: '600',
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
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.white,
    backgroundColor: colors.loginBtn,
    borderRadius: 20,
    alignItems: 'center',
  },
  ceButtonText: {
    color: colors.white,
    fontSize: 18,
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
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vrButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
const dark = StyleSheet.create({
  ...light,
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
