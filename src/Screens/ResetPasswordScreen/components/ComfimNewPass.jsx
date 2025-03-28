import React, {memo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../assets/common/colorCss';

const ComfirmNewPass = ({data, handleInputChange, handleResetPass}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const [error, setError] = useState({name: '', email: '', password: ''});

  const handleRequest = () => {
    let newError = {name: '', email: '', password: ''};

    if (!data.newEmail.length) {
      newError.newEmail = t('email_required');
    } else if (!data.newEmail.endsWith('@gmail.com')) {
      newError.newEmail = t('email_invalid');
    }

    if (!data.newPassword.length) {
      newError.newPassword = t('password_required');
    }else if (data.newPassword.length < 8){
      newError.newPassword = t('password_invalid');
    }

    // Kiểm tra xác nhận mật khẩu
    if (!data.cfNewPassword.length) { // Sửa ở đây
      newError.cfNewPassword = t('cfnewPassword_required'); // Sửa ở đây
    } else if (data.cfNewPassword !== data.newPassword) { // Sửa ở đây
      newError.cfNewPassword = t('cfnewPassword_mismatch'); // Sửa ở đây
    }

    setError(newError);

    // Nếu không có lỗi, gọi handleRegister
    if (!newError.name && !newError.email && !newError.password) {
      handleResetPass();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>{t('iot_management_system')}</Text>
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtLogin}>{t('forgot_password')}</Text>

          {/* Input Name */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.newEmail}
              onChangeText={text => handleInputChange('newEmail', text)}
              placeholder={t('enter_email')}
              style={styles.txtInput}
            />
            {error.name ? (
              <Text style={styles.errorText}>{error.name}</Text>
            ) : null}
          </View>

          {/* Input Email */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.newPassword}
              onChangeText={text => handleInputChange('newPassword', text)}
              placeholder={t('enter_new_password')}
              style={styles.txtInput}
            />
            {error.email ? (
              <Text style={styles.errorText}>{error.email}</Text>
            ) : null}
          </View>

          {/* Input Password */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.cfnewPassword}
              onChangeText={text => handleInputChange('cfNewPassword', text)}
              secureTextEntry
              placeholder={t('enter_again_password')}
              style={styles.txtInput}
            />
            {error.password ? (
              <Text style={styles.errorText}>{error.password}</Text>
            ) : null}
          </View>
        </View>

        {/* Button */}
        <View style={styles.layoutbtn}>
          <Pressable style={styles.btnLogin} onPress={handleRequest}>
            <Text style={styles.txtBtn}>{t('send_code')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default memo(ComfirmNewPass);

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
  },
  txtLogin: {
    fontSize: 34,
    color: colors.black,
    fontWeight: 'bold',
  },
  edtInput: {
    width: '100%',
    height: 40,
    backgroundColor: colors.loginInput,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  txtInput: {
    maxWidth: '90%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  layoutbtn: {
    width: '100%',
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  btnLogin: {
    width: '80%',
    height: 40,
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
