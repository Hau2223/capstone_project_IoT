import React, {memo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../assets/common/colorCss';

const Request = ({data, handleInputChange, handleData, handleRegister}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [error, setError] = useState({name: '', email: '', password: ''});

  const handleRequest = () => {
    let newError = {name: '', email: '', password: ''};

    if (!data.name.length) {
      newError.name = t('name_required');
    }
    if (!data.email.length) {
      newError.email = t('email_required');
    } else if (!data.email.endsWith('@gmail.com')) {
      newError.email = t('email_invalid');
    }

    if (!data.password.length) {
      newError.password = t('password_required');
    } else if (data.password.length < 8) {
      newError.password = t('password_invalid');
    }

    setError(newError);

    // Nếu không có lỗi, gọi handleRegister
    if (!newError.name && !newError.email && !newError.password) {
      handleRegister();

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>{t('iot_management_system')}</Text>
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtLogin}>{t('register')}</Text>

          {/* Input Name */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.name}
              onChangeText={text => handleInputChange('name', text)}
              placeholder={t('enter_name')}
              style={styles.txtInput}
            />
            {error.name ? (
              <Text style={styles.errorText}>{error.name}</Text>
            ) : null}
          </View>

          {/* Input Email */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder={t('enter_email')}
              style={styles.txtInput}
            />
            {error.email ? (
              <Text style={styles.errorText}>{error.email}</Text>
            ) : null}
          </View>

          {/* Input Password */}
          <View style={styles.edtInput}>
            <TextInput
              value={data.password}
              onChangeText={text => handleInputChange('password', text)}
              secureTextEntry
              placeholder={t('enter_password')}
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
            <Text style={styles.txtBtn}>{t('create_account')}</Text>
          </Pressable>
          <Text style={styles.txtAccNaN}>
            {t('had_account')}{' '}
            <Text
              style={styles.txtRegister}
              onPress={() => navigation.navigate('Login')}>
              {t('login')}
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
    gap: 6,
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
    marginBottom: 15,
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
