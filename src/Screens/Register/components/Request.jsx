import React, {memo, useState, useContext} from 'react';
import {Image, Text, View, TextInput, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from '../style';
import colors from '../../../../assets/common/colorCss';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Request = ({data, handleInputChange, handleData, handleRegister}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);

  const [error, setError] = useState({name: '', email: '', password: ''});
  const [showPassword, setShowPassword] = useState(false);

  const handleRequest = () => {
    const newError = {name: '', email: '', password: ''};

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
    <View style={styles.rqContainer}>
      <Image
        style={styles.rqImg}
        source={require('../../../../assets/icon/ic_logo.png')}
      />
      <Text style={styles.rqTitle}>GreenSprout</Text>
      <View style={styles.rqForm}>
        <Text style={styles.rqHeading}>{t('register')}</Text>
        <View style={styles.rqFormInner}>
          {/* Input Name */}
          <View style={styles.rqInputGroup}>
            <View style={styles.rqInputWrapper}>
              <TextInput
                value={data.name}
                onChangeText={text => handleInputChange('name', text)}
                placeholder={t('enter_name')}
                style={styles.rqTextInput}
              />
            </View>
            {error.name && <Text style={styles.rqErrorText}>{error.name}</Text>}
          </View>
          {/* Input Email */}
          <View style={styles.rqInputGroup}>
            <View style={styles.rqInputWrapper}>
              <TextInput
                value={data.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder={t('enter_email')}
                style={styles.rqTextInput}
              />
            </View>
            {error.email && (
              <Text style={styles.rqErrorText}>{error.email}</Text>
            )}
          </View>

          {/* Input Password */}
          <View style={styles.rqInputPasswordWrapper}>
            <TextInput
              value={data.password}
              onChangeText={text => handleInputChange('password', text)}
              secureTextEntry={!showPassword}
              placeholder={t('enter_password')}
              style={[styles.rqTextInput, {flex: 1}]}
            />
            <Pressable onPress={() => setShowPassword(prev => !prev)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color={colors.loginTxt}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.rqButtonGroup}>
          <LinearGradient
            colors={[colors.liner_light1, colors.liner_light2]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            locations={[0, 0.6]}
            style={styles.rqButton}>
            <Pressable onPress={handleRequest}>
              <Text style={styles.rqButtonText}>{t('create_account')}</Text>
            </Pressable>
          </LinearGradient>

          <Text style={styles.rqTextLink}>
            {t('had_account')}{' '}
            <Text
              style={styles.rqTextLogin}
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
