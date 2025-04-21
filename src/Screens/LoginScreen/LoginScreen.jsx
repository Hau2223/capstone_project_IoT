import {
  Text,
  View,
  TextInput,
  Pressable,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  memo,
} from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, loginGoogle} from '../../../services/authServices';
import {UserContext} from '../../../utils/UserContext';
import LinearGradient from 'react-native-linear-gradient';
// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

import colors from '../../../assets/common/colorCss';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';

// GoogleSignin.configure({
//   webClientId:
//     '1028552878321-9502prl6iadm8mgs3gn3n9tjokrniigi.apps.googleusercontent.com',
//   offlineAccess: true,
// });

const LoginScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const deviceId = DeviceInfo.getDeviceId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedFieldEmail, setFocusedFieldEmail] = useState(null);
  const [focusedFieldPass, setFocusedFieldPass] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const {setUserToken} = useContext(UserContext);
  const isFocused = useIsFocused();
  const textInputUserRef = useRef(null);
  const textInputPassRef = useRef(null);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleDelUserVisible = () => {
    setEmail('');
  };
  const toggleDelPasVisible = () => {
    setPassword('');
  };

  const handleLogin = useCallback(() => {
    if (!email || !password) {
      setShowInfoAlert(true);
      console.log('Email và mật khẩu không được để trống');
      return;
    }
    login({email, password, deviceId})
      .then(response => {
        if (response?.data) {
          const token = response.data;
          setShowInfoAlert(false);

          // Lưu token
          AsyncStorage.setItem('authToken', token)
            .then(() => console.log('Token đã được lưu:', token))
            .catch(err => console.log('Lỗi lưu token:', err));

          // Lưu thông tin user
          const userData = {
            idUser: response.data.idUser,
            email: email
          };
          AsyncStorage.setItem('user', JSON.stringify(userData))
            .then(() => console.log('User data đã được lưu:', userData))
            .catch(err => console.log('Lỗi lưu user data:', err));

          setUserToken(token);
          navigation.navigate('Tabs');
        } else {
          console.log('Không nhận được token từ response', response);
          setShowInfoAlert(true);
        }
      })
      .catch(err => {
        const errMsg = err.response?.data?.message || err.message;

        if (errMsg === 'User not found') {
          console.log('Tài khoản không tồn tại');
        } else if (errMsg === 'Invalid password') {
          console.log('Sai mật khẩu');
        } else {
          console.log('Lỗi không xác định:', errMsg);
        }

        setShowInfoAlert(true);
      });
  }, [email, password, deviceId, setUserToken, navigation]);

  // const onGoogleButtonPress = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const { idToken } = await GoogleSignin.signIn();
  
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
  //     const userCredential = await auth().signInWithCredential(googleCredential);
  
  //     console.log('User signed in:', userCredential.user);
  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error);
  //   }
  // };

  const shouldExitApp = React.useCallback(() => {
    const currentRoute =
      navigation.getState().routes[navigation.getState().index].name;
    return currentRoute === 'Login';
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      if (shouldExitApp()) {
        BackHandler.exitApp();
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => subscription.remove();
  }, [navigation, shouldExitApp]);
  console.log(theme);
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

      <Image
        source={require('../../../assets/icon/ic_logo.png')}
        style={styles.imgLogo}
      />
      <Text style={styles.txtTitle}>GreenSprout</Text>
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtLogin}>{t('login')}</Text>
          <View
            style={styles.edtInput}
            onTouchStart={() => {
              textInputUserRef.current.focus();
            }}>
            <TextInput
              ref={textInputUserRef}
              value={email}
              selectionColor={colors.loginTxt}
              underlineColorAndroid="transparent"
              onChangeText={text => setEmail(text)}
              onFocus={() => setFocusedFieldEmail('email')}
              onBlur={() => setFocusedFieldEmail(null)}
              placeholder={t('enter_email')}
              placeholderTextColor={colors.loginTxt}
              style={styles.txtInput}
            />
            {focusedFieldEmail && email.length > 0 && (
              <>
                <Pressable onPress={toggleDelUserVisible}>
                  <IconOni
                    name="close-circle"
                    color={colors.loginTxt}
                    size={20}
                  />
                </Pressable>
              </>
            )}
          </View>
          <View
            style={styles.edtInput}
            onTouchStart={() => {
              textInputPassRef.current.focus();
            }}>
            <TextInput
              ref={textInputPassRef}
              value={password}
              selectionColor={colors.loginTxt}
              underlineColorAndroid="transparent"
              onChangeText={text => setPassword(text)}
              onFocus={() => setFocusedFieldPass('password')}
              onBlur={() => setFocusedFieldPass(null)}
              secureTextEntry={!showPassword}
              placeholder={t('enter_password')}
              placeholderTextColor={colors.loginTxt}
              passwordRules="required: minlength: 8;"
              style={styles.txtInput}
            />
            <View style={styles.iconPass}>
              {focusedFieldPass && password.length > 0 && (
                <Pressable onPress={toggleDelPasVisible}>
                  <IconOni
                    name="close-circle"
                    color={colors.loginTxt}
                    size={20}
                  />
                </Pressable>
              )}
              <IconOni
                name={showPassword ? 'eye-off-sharp' : 'eye-sharp'}
                color={colors.loginTxt}
                size={20}
                onPress={togglePasswordVisibility}
              />
            </View>
          </View>
          {showInfoAlert && (
            <Text style={{color: 'red', fontSize: 12}}>
              {t('login_failed_message')}
            </Text>
          )}
          <Text
            style={styles.txtForget}
            onPress={() => {
              navigation.navigate('ResetPass', {email});
            }}>
            {t('forgot_password')}
          </Text>
        </View>
        <View style={styles.layoutbtn}>
          <LinearGradient
            colors={[colors.liner_light1, colors.liner_light2]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            locations={[0, 0.6]}
            style={styles.btnLogin} // Bạn vẫn giữ styles.btnLogin để định dạng kích thước, padding, border radius, v.v.
          >
            <Pressable onPress={handleLogin}>
              <Text style={styles.txtBtn}>{t('login')}</Text>
            </Pressable>
          </LinearGradient>
          {/* <View style={styles.wrapperManual}>
            <Text style={styles.textManual}>Hoặc đăng kí với</Text>
          </View> */}

          {/* <Pressable style={styles.btnGoogle} onPress={onGoogleButtonPress}>
            <Text style={styles.txtGoogle}>{t('loginGoogle')}</Text>
          </Pressable> */}

          <Text style={styles.txtAccNaN}>
            {t('no_account')}{' '}
            <Text
              style={styles.txtRegister}
              onPress={() => navigation.navigate('Register')}>
              {t('register')}
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default memo(LoginScreen);
