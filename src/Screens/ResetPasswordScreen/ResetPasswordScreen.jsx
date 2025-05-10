import { StatusBar } from 'react-native';
import React, { useState, useCallback, useContext, memo, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import HeaderCompo from '../../components/HeaderCompo';
import ComfirmEmail from './components/ComfirmEmail';
import AlertModelCompo from '../../components/AlertModelCompo';
import {
  resetPass,
  sendEmailReset,
  sendOTPEmail,
  verifyOTP,
} from '../../../services/authServices';
import VerifyReset from './components/VerifyReset';
import LinearGradient from 'react-native-linear-gradient';
import ComfimNewPass from './components/ComfimNewPass';
import { ThemeContext } from '../../../assets/common/themeProvider';
import { createStyle } from './style';
import { useTranslation } from 'react-i18next';
import colors from '../../../assets/common/colorCss';
import LoadingModal from '../../components/LoadingModal';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const { theme } = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const [step, setStep] = useState('confirm');
  const [data, setData] = useState({
    newEmail: email || '',
    newPassword: '',
    cfNewPassword: '',
  });
  const [modal, setModal] = useState({ visible: false, type: '', message: '' });
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type, message, title = '') => {
    setModal({ visible: true, type, title, message });
  };

  const closeAlert = () => {
    setModal({ ...modal, visible: false });
  };

  const handleBack = useCallback(() => {
    if (step === 'verify') {
      setStep('confirm');
    } else if (step === 'confirmNewpass') {
      setStep('verify');
    } else {
      navigation.goBack();
    }
  }, [navigation, step]);

  const handleInputChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleEmail = useCallback(() => {
    if (!data.newEmail.length) {
      showAlert(t('alert_warning'), t('email_required'));
      return false;
    } else if (!data.newEmail.endsWith('@gmail.com')) {
      showAlert(t('alert_warning'), t('email_invalid'));
      return false;
    }
    return true;
  }, [data]);

  const handleSendCode = () => {
    if (!handleEmail()) {
      return;
    }
    setIsLoading(true);

    sendEmailReset({ email: data.newEmail })
      .then(response => {
        console.log('Mã OTP đã gửi:', response);
        setStep('verify');
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert(t('alert_error'), t('otp_send_error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReSendCode = () => {
    if (!handleEmail()) {
      return;
    }
    setIsLoading(true);

    sendEmailReset({ email: data.newEmail })
      .then(res => {
        console.log('Mã OTP được gửi lại', res);
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert(t('alert_error'), t('otp_send_error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerifyOTP = otp => {
    setIsLoading(true);

    verifyOTP({ email: data.newEmail, code: otp })
      .then(res => {
        showAlert(t('alert_success'), t('otp_verification_success'));
        if (res.status === 200) {
          setOnConfirmAction(() => () => {
            setModal({ ...modal, visible: false });
            setStep('confirmNewpass');
          });
        }
      })
      .catch(err => {
        console.error('Lỗi xác minh OTP:', err.response.data.message);
        if (err.response.data.message === 'Invalid OTP code') {
          showAlert(t('alert_warning'), t('invalid_otp_code'));
        } else if (err.response.data.message === 'OTP has expired') {
          showAlert(t('alert_warning'), t('otp_expired_message'));
        } else {
          showAlert(t('alert_error'), t('otp_invalid_or_expired'));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetPass = () => {
    setIsLoading(true);

    resetPass({ email: data.newEmail, newPassword: data.newPassword })
      .then(res => {
        console.log('Xác minh thành công:', res);
        setData({ newEmail: '', newPassword: '', cfNewPassword: '' });
        showAlert(t('alert_success'), t('password_reset_success'));
        setOnConfirmAction(() => () => {
          setModal({ ...modal, visible: false });
          navigation.navigate('Login');
        });
      })
      .catch(err => {
        console.error('Lỗi reset password:', err.response.data.message);
        showAlert(t('alert_error'), t('password_reset_failed'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={[colors.liner_light1, colors.liner_light2]}
      style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={colors.liner_light1}
          barStyle={'light-content'}
        />
      )}
      {step === 'confirm' && (
        <ComfirmEmail
          email={data.newEmail}
          handleInputChange={handleInputChange}
          handleEmail={handleEmail}
          handleBack={handleBack}
          handleSendCode={handleSendCode}
        />
      )}
      {step === 'verify' && (
        <VerifyReset
          email={data.newEmail}
          handleVerifyOTP={handleVerifyOTP}
          handleReSendCode={handleReSendCode}
          handleBack={handleBack}
        />
      )}
      {step === 'confirmNewpass' && (
        <ComfimNewPass
          data={data}
          handleInputChange={handleInputChange}
          handleResetPass={handleResetPass}
          handleBack={handleBack}
        />
      )}

      <AlertModelCompo
        isVisible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={() => {
          if (onConfirmAction) {
            onConfirmAction();
            setOnConfirmAction(null);
          } else {
            setModal({ ...modal, visible: false });
          }
        }}
        onCancel={closeAlert}
      />

      <LoadingModal isLoading={isLoading} />
    </LinearGradient>
  );
};

export default memo(ResetPasswordScreen);