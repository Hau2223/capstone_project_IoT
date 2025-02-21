import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useRef, memo} from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../assets/common/colorCss';

const Request = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [focusedFieldPhone, setFocusedFieldPhone] = useState(null);
  const [focusedFieldPass, setFocusedFieldPass] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
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
  


  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>HỆ THỐNG QUẢN LÝ THIẾT BỊ IOT</Text>
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtLogin}>Đăng Kí</Text>
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
              placeholder={'Nhập Email'}
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
              placeholder={'Nhập mật khẩu'}
              placeholderTextColor={colors.loginTxt}
              passwordRules="required: lower; required: upper; required: digit; max-consecutive: 2; minlength: 8;"
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
        </View>
        <View style={styles.layoutbtn}>
          <Pressable style={styles.btnLogin} onPress={() => console.log('123')}>
            <Text style={styles.txtBtn}>Tạo Tài Khoản</Text>
          </Pressable>
          <Text style={styles.txtAccNaN}>
            Bạn đã có tài khoản?{' '}
            <Text
              style={styles.txtRegister}
              onPress={() => navigation.navigate('Login')}>
              Đăng nhập
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(Request);

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
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

    gap: 18,
  },
  txtLogin: {
    fontSize: 34,
    color: colors.black,
    fontWeight: 'bold',
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
    paddingVertical: 20,
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
