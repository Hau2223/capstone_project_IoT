import {Pressable, StyleSheet, View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {OtpInput} from 'react-native-otp-entry';
import colors from '../../../../assets/common/colorCss';
import { useTranslation } from 'react-i18next';

const VerifyReset = ({email, handleVerifyOTP, handleReSendCode}) => {
  const {t} = useTranslation();
  const [otp, setOtp] = useState('');

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../../../assets/icon/ic_protect.png')}
      />
      <Text style={styles.txtTitle}>{t('otp_verification')}</Text>
      <Text style={styles.txtSub}>
        {t('otp_sent_message')} {'\n'}
        {email}
      </Text>
      <View style={styles.formLogin}>
        <OtpInput
          numberOfDigits={4}
          onTextChange={text => setOtp(text)}
          // focusColor={colors.loginInput}
          disabled={false}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          theme={{
            pinCodeContainerStyle: {
              backgroundColor: colors.white,
              width: 50,
              height: 50,
              borderRadius: 8,
              marginHorizontal: 5,
              focusedPinCodeContainerStyle: colors.green,
              borderWidth: 2,
            },
            pinCodeTextStyle: {
              color: colors.green,
            },
          }}
        />
        <Text style={styles.txtNaNOtp}>
          {t('did_not_receive_code')}{' '}
          <Text style={styles.reSendOTP} onPress={() => handleReSendCode()}>
            {t('resend_code')}
          </Text>
        </Text>
        <Pressable onPress={() => handleVerifyOTP(otp)} style={styles.button}>
          <Text style={styles.buttonText}>{t('verify')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerifyReset;

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: colors.background,
  },
  img: {
    width: 100,
    height: 100,
    backgroundColor: colors.green,
    borderRadius: 50,
  },
  formLogin: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
    gap: 20,
  },
  txtTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  txtSub: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  txtNaNOtp: {
    color: colors.white,
    fontSize: 15,
    textAlign: 'center',
  },
  reSendOTP: {
    color: colors.reSendOTP,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    padding: 12,
    backgroundColor: colors.loginBtn,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
