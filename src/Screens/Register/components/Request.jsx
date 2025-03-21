import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import React, {memo} from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../assets/common/colorCss';

const Request = ({data, handleInputChange, handleData}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>HỆ THỐNG QUẢN LÝ THIẾT BỊ IOT</Text>
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtLogin}>Đăng Kí</Text>
          <View style={styles.edtInput}>
            <TextInput
              value={data.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder={'Nhập Email'}
              style={styles.txtInput}
            />
          </View>
          <View style={styles.edtInput}>
            <TextInput
              value={data.password}
              onChangeText={text => handleInputChange('password', text)}
              secureTextEntry
              placeholder={'Nhập mật khẩu'}
              style={styles.txtInput}
            />
          </View>
        </View>
        <View style={styles.layoutbtn}>
          <Pressable style={styles.btnLogin} onPress={handleData}>
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
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  txtInput: {
    maxWidth: '90%',
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
