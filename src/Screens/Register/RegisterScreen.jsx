import {StatusBar, Modal, ActivityIndicator, View, Text} from 'react-native';
import React, {useState, useCallback, memo, useContext, useEffect} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import HeaderCompo from '../../components/HeaderCompo';
import Request from './components/Request';
import Verification from './components/Verification';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import {signUp, sendOTPEmail, verifyOTP} from '../../../services/authServices';
import Comfirm from './components/Comfirm';
import AlertModelCompo from '../../components/AlertModelCompo';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../assets/common/colorCss';
import LoadingModal from '../../components/LoadingModal';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [step, setStep] = useState('request');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [modal, setModal] = useState({visible: false, type: '', message: ''});
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type, message, title = '') => {
    setModal({visible: true, type, title, message});
  };

  const closeAlert = () => {
    setModal({...modal, visible: false});
  };

  const handleBack = useCallback(() => {
    if (step === 'comfirm') {
      setStep('request');
    } else if (step === 'verifyOTP') {
      setStep('comfirm');
    } else {
      navigation.goBack();
    }
  }, [navigation, step]);

  const handleEmail = useCallback(() => {
    if (!data.email.length) {
      showAlert(t('alert_warning'), t('email_required'));
      return false;
    } else if (!data.email.endsWith('@gmail.com')) {
      showAlert(t('alert_warning'), t('email_invalid'));
      return false;
    }
    return true;
  }, [data.email, t]);

  const handleInputChange = (key, value) => {
    setData(prev => ({...prev, [key]: value}));
  };

  const handleSendCode = () => {
    if (!handleEmail()) {
      return;
    }
    setIsLoading(true);

    sendOTPEmail({email: data.email})
      .then(response => {
        console.log('Mã OTP đã gửi:', response);
        if (response.message === 'Email sent successfully') {
          setStep('verifyOTP');
        }
      })
      .catch(error => {
        console.error('Lỗi không thể gửi mã OTP!:', error);
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
    sendOTPEmail({email: data.email})
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
    verifyOTP({email: data.email, code: otp})
      .then(res => {
        showAlert(t('alert_success'), t('otp_verification_success'));
        signUp({name: data.name, email: data.email, password: data.password})
          .then(res => {
            showAlert(t('alert_success'), t('registration_success_message'));
            setData({name: '', email: '', password: ''});
            setOnConfirmAction(() => () => {
              setModal({...modal, visible: false});
              navigation.navigate('Login');
            });
          })
          .catch(err => {
            console.error('Lỗi đăng ký:', err.response.data.message);
            showAlert(t('alert_error'), t('registration_error'));
          });
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

  const handleRegister = () => {
    setStep('comfirm');
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
      <HeaderCompo
        isPress={handleBack}
        color={colors.white}
        bgcolor={colors.bg_NaN}
      />
      {step === 'request' && (
        <Request
          data={data}
          handleInputChange={handleInputChange}
          handleRegister={handleRegister}
        />
      )}
      {step === 'comfirm' && (
        <Comfirm
          email={data.email}
          handleEmail={handleEmail}
          handleSendCode={handleSendCode}
          handleInputChange={handleInputChange}
        />
      )}
      {step === 'verifyOTP' && (
        <Verification
          email={data.email}
          handleVerifyOTP={handleVerifyOTP}
          handleReSendCode={handleReSendCode}
        />
      )}

      {/* Modal Alert */}
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
            setModal({...modal, visible: false});
          }
        }}
        onCancel={closeAlert}
      />

      {/* Modal Loading */}
      <LoadingModal isLoading={isLoading} />
    </LinearGradient>
  );
};

export default memo(RegisterScreen);
