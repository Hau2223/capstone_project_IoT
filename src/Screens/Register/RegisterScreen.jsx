import {StyleSheet, ImageBackground, useWindowDimensions} from 'react-native';
import React, {useState, useCallback, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {IMAGES} from '../../../utils/constants';

import HeaderCompo from '../../components/HeaderCompo';
import Request from './components/Request';
import Verification from './components/Verification';
import {signUp, sendOTPEmail, verifyOTP} from '../../../services/authServices';
import Comfirm from './components/Comfirm';
import AlertModelCompo from '../../components/AlertModelCompo'; // Import modal

const RegisterScreen = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const isTablet = width >= 720;

  const [step, setStep] = useState('request');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State cho Modal
  const [modal, setModal] = useState({visible: false, type: '', message: ''});

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

  // const handleData = useCallback(() => {
  //   console.log('Dữ liệu đăng ký:', data);

  //   // Kiểm tra định dạng email phải có đuôi @gmail.com
  //   if (!data.email.endsWith('@gmail.com')) {
  //     showAlert('warning', 'Email phải kết thúc là @gmail.com');
  //     return false;
  //   } else if (data.email.length < 0 && data.password.length < 0) {
  //     showAlert('warning', 'Vui lòng kiểm tra lại thông tin');
  //     return false;
  //   }
  //   return true;
  // }, [data]);

  const handleEmail = useCallback(() => {
    if (!data.email.length) {
      showAlert('warning', 'Vui lòng nhập email của bạn');
      return false;
    } else if (!data.email.endsWith('@gmail.com')) {
      showAlert('warning', 'Email phải có đuôi @gmail.com');
      return false;
    }
    return true; // Email hợp lệ
  }, [data]);

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
        setStep('verifyOTP');
        // showAlert('success', 'Mã OTP đã được gửi!');
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
        showAlert('error', 'Lỗi khi gửi OTP!');
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
        showAlert('error', 'Lỗi khi gửi OTP!');
      });
  };

  const handleVerifyOTP = otp => {
    verifyOTP({email: data.email, code: otp})
      .then(res => {
        console.log('Xác minh thành công:', res);
        showAlert('success', 'Xác minh thành công!');
        signUp({name: data.name, email: data.email, password: data.password})
          .then(res => {
            console.log('Xác minh thành công:', res);
            showAlert('success', 'Đăng kí tài khoản thành công');
            setData('');
            navigation.navigate('Login');
          })
          .catch(err => {
            console.error('Lỗi xác minh OTP:', err.response.data.message);
          });
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

  const handleRegister = () => {
    // if (!handleData()) {
    //   return;
    // }
    setStep('comfirm');
  };

  return (
    <ImageBackground
      source={{uri: isTablet ? IMAGES.BG_TABLET : IMAGES.BG_MOBILE}}
      style={styles.container}>
      <HeaderCompo isPress={handleBack} />
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
        onConfirm={closeAlert}
        onCancel={closeAlert}
      />
    </ImageBackground>
  );
};

export default memo(RegisterScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
});
