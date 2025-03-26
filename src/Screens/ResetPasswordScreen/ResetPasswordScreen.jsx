import {
  StyleSheet,
  Text,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {IMAGES} from '../../../utils/constants';
import HeaderCompo from '../../components/HeaderCompo';
import ComfirmEmail from './components/ComfirmEmail';
import AlertModelCompo from '../../components/AlertModelCompo';
import {resetPass, sendOTPEmail, verifyOTP} from '../../../services/authServices';
import VerifyReset from './components/VerifyReset';
import ComfimNewPass from './components/ComfimNewPass';

const ResetPasswordScreen = ({route}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const isTablet = width >= 720;
  const {email} = route.params;
  const [step, setStep] = useState('comfirm');
  const [data, setData] = useState({
    newEmail: email || '',
    newPassword: '',
    cfNewPassword: '',
  });
  const [modal, setModal] = useState({visible: false, type: '', message: ''});
  const showAlert = (type, message, title = '') => {
    setModal({visible: true, type, title, message});
  };
  const closeAlert = () => {
    setModal({...modal, visible: false});
  };

  const handleBack = useCallback(() => {
    if (step === 'verify') {
      setStep('comfirm');
    } else if (step === 'comfirmNewpass') {
      setStep('verify');
    } else {
      navigation.goBack();
    }
  }, [navigation, step]);

  console.log(email);

  const handleInputChange = (key, value) => {
    setData(prev => ({...prev, [key]: value}));
  };

  const handleEmail = useCallback(() => {
    if (!data.newEmail.length) {
      showAlert('warning', 'Vui lòng nhập email của bạn');
      return false;
    } else if (!data.newEmail.endsWith('@gmail.com')) {
      showAlert('warning', 'Email phải có đuôi @gmail.com');
      return false;
    }
    return true; // Email hợp lệ
  }, [data]);

  const handleSendCode = () => {
    if (!handleEmail()) {
      return;
    }
    sendOTPEmail({email: data.newEmail})
      .then(response => {
        console.log('Mã OTP đã gửi:', response);
        setStep('verify');
        // showAlert('success', 'Mã OTP đã được gửi!');
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert('error', 'Lỗi khi gửi OTP!');
      });
  };
  const handleReSendCode = () => {
    if (!handleEmail()) {
      return;
    }
    sendOTPEmail({email: data.newEmail})
      .then(res => {
        console.log('Mã OTP được gửi lại', res);
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert('error', 'Lỗi khi gửi OTP!');
      });
  };

  const handleVerifyOTP = otp => {
    verifyOTP({email: data.newEmail, code: otp})
      .then(res => {
        console.log('Xác minh thành công:', res);
        showAlert('success', 'Xác minh thành công!');
        setStep('comfirmNewpass');
      })
      .catch(err => {
        // console.error('Lỗi xác minh OTP:', err.response.data.message);
        if (err.response.data.message === 'Invalid OTP code') {
          showAlert('warning', 'Invalid OTP code');
        } else if (err.response.data.message === 'OTP has expired') {
          showAlert('warning', 'TP has expired');
        } else {
          showAlert('error', 'Mã OTP không hợp lệ hoặc đã hết hạn');
        }
      });
  };

  const handleResetPass = () => {
      // if (!handleData()) {
      //   return;
      // }
      resetPass({email: data.newEmail, newPassword: data.newPassword})
        .then(res => {
          console.log('Xác minh thành công:', res);
          showAlert('success', 'Đăng kí tài khoản thành công');
          setData('');
          navigation.navigate('Login');
        })
        .catch(err => {
          console.error('Lỗi xác minh OTP:', err.response.data.message);
        });
  };

  return (
    <ImageBackground
      source={{uri: isTablet ? IMAGES.BG_TABLET : IMAGES.BG_MOBILE}}
      style={styles.container}>
      <HeaderCompo isPress={handleBack} />
      {step === 'comfirm' && (
        <ComfirmEmail
          email={data.newEmail}
          handleInputChange={handleInputChange}
          handleEmail={handleEmail}
          handleSendCode={handleSendCode}
        />
      )}
      {step === 'verify' && (
        <VerifyReset
          email={data.newEmail}
          handleVerifyOTP={handleVerifyOTP}
          handleReSendCode={handleReSendCode}
        />
      )}
      {step === 'comfirmNewpass' && (
        <ComfimNewPass
          data={data}
          handleInputChange={handleInputChange}
          handleResetPass={handleResetPass}
        />
      )}

      <AlertModelCompo
        isVisible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={closeAlert}
        onCancel={closeAlert}
      />
    </ImageBackground>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
});
