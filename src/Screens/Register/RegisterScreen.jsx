import {StatusBar} from 'react-native';
import React, {useState, useCallback, memo, useContext} from 'react';
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

  // State cho Modal
  const [modal, setModal] = useState({visible: false, type: '', message: ''});
  const [onConfirmAction, setOnConfirmAction] = useState(null);
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
    return true; // Email hợp lệ
  }, [data.email, t]);

  const handleInputChange = (key, value) => {
    setData(prev => ({...prev, [key]: value}));
  };

  const handleSendCode = () => {
    if (!handleEmail()) {
      // Nếu email không hợp lệ, dừng hàm
      return;
    }

    sendOTPEmail({email: data.email})
      .then(response => {
        console.log('Mã OTP đã gửi:', response);
        if (response.message === 'Email sent successfully') {
          setStep('verifyOTP');
        }

        // showAlert('success', 'Mã OTP đã được gửi!');
      })
      .catch(error => {
        console.error('Lỗi không thể gửi mã OTP!:', error);
        showAlert(t('alert_error'), t('otp_send_error'));
      });
  };
  const handleReSendCode = () => {
    if (!handleEmail()) {
      // Nếu email không hợp lệ, dừng hàm
      return;
    }
    sendOTPEmail({email: data.email})
      .then(res => {
        console.log('Mã OTP được gửi lại', res);
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert(t('alert_error'), t('otp_send_error'));
      });
  };

  const handleVerifyOTP = otp => {
    verifyOTP({email: data.email, code: otp})
      .then(res => {
        console.log('Xác minh thành công:', res);
        showAlert(t('alert_success'), t('otp_verification_success'));
        signUp({name: data.name, email: data.email, password: data.password})
          .then(res => {
            console.log('Xác minh thành công:', res);
            showAlert(t('alert_success'), t('registration_success_message'));
            setData('');
            setOnConfirmAction(() => () => {
              setModal({...modal, visible: false});
              navigation.navigate('Login');
            });
          })
          .catch(err => {
            console.error('Lỗi xác minh OTP:', err.response.data.message);
          });
      })
      .catch(err => {
        // console.error('Lỗi xác minh OTP:', err.response.data.message);
        if (err.response.data.message === 'Invalid OTP code') {
          showAlert(t('alert_warning'), t('invalid_otp_code'));
        } else if (err.response.data.message === 'OTP has expired') {
          showAlert(t('alert_warning'), t('otp_expired_message'));
        } else {
          showAlert(t('alert_error'), t('otp_invalid_or_expired'));
        }
      });
  };

  const handleRegister = () => {
    // if (!handleData()) {
    //   return;
    // }
    setStep('comfirm');
  };

  return (
    <LinearGradient
      colors={
        [colors.liner_light1, colors.liner_light2]
      }
      style={styles.container}>
        {isFocused && (
        <StatusBar
          backgroundColor={colors.liner_light1}
          barStyle={'light-content'}
        />
      )}
      <HeaderCompo isPress={handleBack} color={colors.white} bgcolor={colors.bg_NaN}/>
      {step === 'request' && (
        <Request
          data={data}
          handleInputChange={handleInputChange}
          // handleData={handleData}
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
    </LinearGradient>
  );
};

export default memo(RegisterScreen);
