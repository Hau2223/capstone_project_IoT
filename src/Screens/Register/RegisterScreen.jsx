import {
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  Alert,
} from 'react-native';
import React, {useState, useCallback, memo} from 'react';
import {useNavigation} from '@react-navigation/native';

import colors from '../../../assets/common/colorCss';
import {IMAGES} from '../../../utils/constants';

import HeaderCompo from '../../components/HeaderCompo';
import Request from './components/Request';
import Verification from './components/Verification';
import {signUp, sendOTPEmail, verifyOTP} from '../../../services/authServices';
import Comfirm from './components/Comfirm';
import {emit} from '../../../server/models/userModel';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const isTablet = width >= 720;

  const [step, setStep] = useState('request');
  const [data, setData] = useState({
    name: 'Van a',
    email: '',
    password: '',
    code: '',
  });

  const handleBack = useCallback(() => {
    if (step === 'comfirm') {
      setStep('request');
    } else if (step === 'verifyOTP') {
      setStep('comfirm');
    } else {
      navigation.goBack();
    }
  }, [navigation, step]);

  const handleData = useCallback(() => {
    console.log('Dữ liệu đăng ký:', data);

    // Kiểm tra định dạng email phải có đuôi @gmail.com
    if (!data.email.endsWith('@gmail.com')) {
      Alert.alert('Email phải có đuôi @gmail.com');
      return;
    }

    if (data.email.length > 0 && data.password.length > 0) {
      setStep('comfirm');
    }
  }, [data]);

  const handleInputChange = (key, value) => {
    setData(prev => ({...prev, [key]: value}));
  };

  const handleSendCode = () => {
    sendOTPEmail({email: data.email})
      .then(response => {
        console.log('Mã OTP đã gửi:', response);
        setStep('verifyOTP');
      })
      .catch(error => {
        console.error('Lỗi khi gửi OTP:', error);
      });
  };

  const handleVerifyOTP = otp => {
    verifyOTP({email: data.email, code: otp})
      .then(res => {
        console.log('Xác minh thành công:', res);
        Alert.alert('Xác minh thành công!');
      })
      .catch(err => {
        console.error('Lỗi xác minh OTP:', err.response.data.message);
        Alert.alert('Mã OTP không hợp lệ hoặc đã hết hạn!');
      });
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
          handleData={handleData}
        />
      )}
      {step === 'comfirm' && (
        <Comfirm
          email={data.email}
          handleSendCode={handleSendCode}
          handleInputChange={handleInputChange}
        />
      )}
      {step === 'verifyOTP' && (
        <Verification email={data.email} handleVerifyOTP={handleVerifyOTP} />
      )}
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
