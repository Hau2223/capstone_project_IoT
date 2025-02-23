import {StyleSheet, ImageBackground, useWindowDimensions} from 'react-native';
import React, {useState, useEffect, useCallback, memo} from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import colors from '../../../assets/common/colorCss';
import {IMAGES} from '../../../utils/constants';

import HeaderCompo from '../../components/HeaderCompo';
import Request from './components/Request';
import Verification from './components/Verification';
import {signUp, verifyCode} from '../../../services/authServices';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const isTablet = width >= 720;

  const [data, setData] = useState({
    login: '',
    mode: 'create',
    verifyCode: '',
    option: 'phone',
    token: '',
  });

  const [step, setStep] = useState('request');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isComfirming, setIsComfirming] = useState(false);
  const [isReseting, setIsReseting] = useState(false);

  const [validCode, setValidCode] = useState(true);
  const [validPwd, setValidPwd] = useState(true);
  const [validPhone, setValidPhone] = useState(true);

  const handleBack = useCallback(() => {
    if (step === 'verification') setStep('request');
    else navigation.goBack();
  }, [navigation, step]);

  // const handleRequest = data => {
  //   setIsRequesting(true);
  //   setValidCode(true);
  //   setValidPwd(true);
  //   setData(c => ({...c, ...data}));
  //   signUp(data)
  //     .then(res => {
  //       console.log('request', res);
  //       setIsRequesting(false);
  //       setStep('verification');
  //     })
  //     .catch(err => {
  //       setValidPhone(false);
  //       setIsRequesting(false);
  //       console.log('request err', err);
  //     });
  // };

  // const handleConfirm = code => {
  //   setIsComfirming(true);
  //   setValidPwd(true);
  //   verifyCode({
  //     login: data.login,
  //     otp: code,
  //     mode: data.mode,
  //   })
  //     .then(res => {
  //       console.log('confirm', res);
  //       const {refesh_token, token, status} = res.result;
  //       if (status === 200) {
  //         setData(c => ({...c, token: token}));
  //         setIsComfirming(false);
  //         // setStep('reset');
  //       } else {
  //         setValidCode(false);
  //         setIsComfirming(false);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('confirm err', err);
  //       setValidCode(false);
  //       setIsComfirming(false);
  //     });
  // };

  return (
    <ImageBackground
      source={{uri: isTablet ? IMAGES.BG_TABLET : IMAGES.BG_MOBILE}}
      style={styles.container}>
      <HeaderCompo isPress={handleBack} />
      {step === 'request' && <Request />}
      {step === 'verification' && <Verification />}
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
