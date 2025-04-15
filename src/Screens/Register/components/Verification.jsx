import {Pressable, StyleSheet, View, Text, Image} from 'react-native';
import React, {memo, useState, useEffect, useContext} from 'react';
import {OtpInput} from 'react-native-otp-entry';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from '../style';
import colors from '../../../../assets/common/colorCss';
import LinearGradient from 'react-native-linear-gradient';

const Verification = ({email, handleVerifyOTP, handleReSendCode}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // 2 phút = 120 giây

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(120);
    handleReSendCode();
  };

  const formatTime = seconds => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.vrContainer}>
      <Image
        style={styles.vrImg}
        source={require('../../../../assets/icon/ic_logo.png')}
      />
      <Text style={styles.vrTitle}>{t('otp_verification')}</Text>
      <Text style={styles.vrSubText}>
        {t('otp_sent_message')} {'\n'}
        {email}
      </Text>
      <View style={styles.vrForm}>
        <OtpInput
          numberOfDigits={4}
          onTextChange={text => setOtp(text)}
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

        <View style={styles.otpContainer}>
          {timer > 0 && (
            <Text style={styles.vrResendText}>
              Thời gian còn lại {formatTime(timer)}
            </Text>
          )}
          <Text style={styles.vrNoticeText}>
            {t('did_not_receive_code')}{' '}
            <Text style={styles.vrResendText} onPress={handleResend}>
              {t('resend_code')}
            </Text>
          </Text>
        </View>

        <LinearGradient
          colors={[colors.liner_light1, colors.liner_light2]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.6]}
          style={styles.vrButton}>
          <Pressable onPress={() => handleVerifyOTP(otp)}>
            <Text style={styles.vrButtonText}>{t('verify')}</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
};

export default memo(Verification);
