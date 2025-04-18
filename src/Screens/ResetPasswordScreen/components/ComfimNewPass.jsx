import React, {memo, useState, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import colors from '../../../../assets/common/colorCss';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from '../style';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ComfirmNewPass = ({data, handleInputChange, handleResetPass}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [error, setError] = useState({
    email: '',
    password: '',
    cfNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    cfNewPassword: false,
  });

  const handleRequest = () => {
    const newError = {
      newEmail: '',
      newPassword: '',
      cfNewPassword: '',
    };
    console.log(data.cfNewPassword);

    if (!data.newEmail.length) {
      newError.newEmail = t('email_required');
    } else if (!data.newEmail.endsWith('@gmail.com')) {
      newError.newEmail = t('email_invalid');
    }

    if (!data.newPassword.length) {
      newError.newPassword = t('password_required');
    } else if (data.newPassword.length < 8) {
      newError.newPassword = t('password_invalid');
    }

    if (!data.cfNewPassword.length) {
      newError.cfNewPassword = t('cfnewPassword_required');
    } else if (data.cfNewPassword !== data.newPassword) {
      newError.cfNewPassword = t('cfnewPassword_mismatch');
    }

    setError(newError);

    if (
      !newError.newEmail &&
      !newError.newPassword &&
      !newError.cfNewPassword
    ) {
      handleResetPass();
    }
  };
  const togglePasswordVisibility = key => {
    setShowPassword(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.cnpContainer}>
      <Image
        style={styles.ceImg}
        source={require('../../../../assets/icon/ic_logo.png')}
      />
      <Text style={styles.cnpTitle}>GreenSprout</Text>
      <View style={styles.cnpForm}>
        <Text style={styles.cnpHeading}>{t('forgot_password')}</Text>
        <View style={styles.cnpFormInner}>
          {/* Input Email */}
          <View style={styles.cnpInputGroup}>
            <View style={styles.cnpInputWrapper}>
              <TextInput
                value={data.newEmail}
                onChangeText={text => handleInputChange('newEmail', text)}
                placeholder={t('enter_email')}
                style={styles.cnpTextInput}
              />
            </View>
            {error.newEmail ? (
              <Text style={styles.cnpErrorText} numberOfLines={2}>
                {error.newEmail}
              </Text>
            ) : null}
          </View>

          {/* Input new password */}
          <View style={styles.cnpInputGroup}>
            <View style={styles.cnpInputWrapper}>
              <TextInput
                value={data.newPassword}
                onChangeText={text => handleInputChange('newPassword', text)}
                placeholder={t('enter_new_password')}
                secureTextEntry={!showPassword.newPassword}
                style={[styles.cnpTextInput, {paddingRight: 40}]}
              
              />
              <TouchableOpacity
                style={styles.cnpEyeIcon}
                onPress={() => togglePasswordVisibility('newPassword')}>
                <Ionicons
                  name={showPassword.newPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={colors.loginTxt}
                />
              </TouchableOpacity>
            </View>

            {error.newPassword ? (
              <Text style={styles.cnpErrorText} numberOfLines={2}>
                {error.newPassword}
              </Text>
            ) : null}
          </View>

          {/* Input comfirm new Password */}
          <View style={styles.cnpInputGroup}>
            <View style={styles.cnpInputWrapper}>
              <TextInput
                value={data.cfNewPassword}
                onChangeText={text => handleInputChange('cfNewPassword', text)}
                placeholder={t('enter_again_password')}
                secureTextEntry={!showPassword.cfNewPassword}
                style={[styles.cnpTextInput, {paddingRight: 40}]}
              />
              <TouchableOpacity
                style={styles.cnpEyeIcon}
                onPress={() => togglePasswordVisibility('cfNewPassword')}>
                <Ionicons
                  name={showPassword.cfNewPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={colors.loginTxt}
                />
              </TouchableOpacity>
            </View>

            {error.cfNewPassword ? (
              <Text style={styles.cnpErrorText} numberOfLines={2}>
                {error.cfNewPasswordm}
              </Text>
            ) : null}
          </View>
        </View>
        {/* Button */}
        <LinearGradient
          colors={[colors.liner_light1, colors.liner_light2]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.6]}
          style={styles.cnpButton}>
          <TouchableOpacity onPress={handleRequest}>
            <Text style={styles.cnpButtonText}>{t('verify')}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default memo(ComfirmNewPass);
