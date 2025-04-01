import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  BackHandler,
  ImageBackground,
  useWindowDimensions,
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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../../../services/authServices';
import {UserContext} from '../../../utils/UserContext';
import colors from '../../../assets/common/colorCss';
import {IMAGES} from '../../../utils/constants';
import {useTranslation} from 'react-i18next';

const LoginScreen = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const isTablet = width >= 720;
  const deviceId = DeviceInfo.getDeviceId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedFieldPhone, setFocusedFieldPhone] = useState(null);
  const [focusedFieldPass, setFocusedFieldPass] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const {setUserToken} = useContext(UserContext);
  const textInputUserRef = useRef(null);
  const textInputPassRef = useRef(null);
  const {t} = useTranslation();

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
    login({
      email,
      password,
      deviceId,
    })
      .then(response => {
        if (response?.status === 404) {
          setShowInfoAlert(true);
        } else if (response?.data) {
          const token = response.data;
          setShowInfoAlert(false);

          AsyncStorage.setItem('authToken', token)
            .then(() => console.log('Token đã được lưu:', token))
            .catch(err => console.log('Lỗi lưu token:', err));

          token && setUserToken(token);
          navigation.navigate('Tabs');
        }
        console.log('Response:', response);
      })
      .catch(err => {
        setShowInfoAlert(true);
        console.log('Login Error', err.response?.data || err.message);
      });
  }, [email, password, deviceId, setUserToken, navigation]);

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

  return (
    <ImageBackground
      source={{uri: isTablet ? IMAGES.BG_TABLET : IMAGES.BG_MOBILE}}
      style={styles.container}>
      <Text style={styles.txtTitle}>{t('iot_management_system')}</Text>
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
              onFocus={() => setFocusedFieldPhone('phone')}
              onBlur={() => setFocusedFieldPhone(null)}
              placeholder={t('enter_email')}
              placeholderTextColor={colors.loginTxt}
              style={styles.txtInput}
            />
            {focusedFieldPhone && email.length > 0 && (
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
                name={showPassword ? 'eye-sharp' : 'eye-off-sharp'}
                color={colors.loginTxt}
                size={20}
                onPress={togglePasswordVisibility}
              />
            </View>
          </View>
          <Text
            style={styles.txtForget}
            onPress={() => {
              navigation.navigate('ResetPass', {email});
            }}>
            {t('forgot_password')}
          </Text>
        </View>
        <View style={styles.layoutbtn}>
          <Pressable style={styles.btnLogin} onPress={handleLogin}>
            <Text style={styles.txtBtn}>{t('login')}</Text>
          </Pressable>
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
    </ImageBackground>
  );
};

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formLogin: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 39,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
    maxWidth: '70%',
    textAlign: 'center',
    marginBottom: 20,
  },
  login: {
    marginVertical: 20,
    width: '80%',
    backgroundColor: colors.white,
    gap: 18,
  },
  txtLogin: {
    fontSize: 34,
    color: colors.black,
    fontWeight: 'bold',
  },
  txtForget: {
    fontStyle: 'italic',
    color: colors.txtForget,
    alignSelf: 'flex-start',
  },
  edtInput: {
    width: '100%',
    height: 36,
    backgroundColor: colors.loginInput,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  txtInput: {
    maxWidth: '90%',
  },
  iconPass: {
    flexDirection: 'row',
    gap: 6,
  },

  layoutbtn: {
    width: '100%',
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnLogin: {
    width: '80%',
    height: 36,
    backgroundColor: colors.loginBtn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  txtBtn: {
    color: colors.white,
    fontSize: 17,
  },
  txtAccNaN: {
    fontSize: 13,
    color: colors.black,
  },
  txtRegister: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
